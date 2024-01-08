const Team = require("../models/team");
const User = require("../models/user");
const Calendar = require("../models/calendar");
const teamValidation = require("../utils/teamValidation");

// Create a team
exports.createTeam = async (req, res) => {
	try {
		console.log("Tworzenie teamu");

		const { name, teamLeadIds, memberIds } = req.body;

		const { error } = teamValidation.validate(req.body);
		if (error) {
			return res.status(400).json({
				message: "Validation error",
				details: error.details.map((detail) => detail.message),
			});
		}

		console.log(`Wartości teamu: ${name}, ${teamLeadIds}, ${memberIds}`);

		// Check if the specified team leader exists and has the correct role
		const teamLeads = await User.find({
			_id: { $in: teamLeadIds },
			role: { $ne: "ADMIN" },
			team: { $exists: false },
		});

		if (teamLeads.length !== teamLeadIds.length) {
			return res.status(400).json({
				message:
					"Invalid team leaders: Do not exist, are admins, or are already part of a team",
			});
		}

		let members = [];

		if (memberIds && memberIds.length) {
			members = await User.find({
				_id: { $in: memberIds },
				role: { $ne: "ADMIN" },
				team: { $exists: false },
			});
			if (members.length !== memberIds.length) {
				return res
					.status(400)
					.json({ message: "One or more members are invalid." });
			}
		}

		// Create a new team
		const newTeam = new Team({
			name,
			teamLeads: teamLeads.map((lead) => lead._id),
			members: members.map((member) => member._id),
		});

		// Automatically create a calendar for the team
		const newCalendar = new Calendar();
		newTeam.calendar = newCalendar._id;

		// Save the team and the calendar
		const savedTeam = await newTeam.save();
		await newCalendar.save();

		const teamLeadUpdates = teamLeads.map((lead) => {
			return User.findByIdAndUpdate(lead._id, {
				$set: { team: savedTeam._id, role: "TEAM LEADER" },
			});
		});

		const memberUpdates = members.map((member) => {
			return User.findByIdAndUpdate(member._id, {
				$set: { team: savedTeam._id },
			});
		});

		await Promise.all([...teamLeadUpdates, ...memberUpdates]);

		res.status(200).json({
			success: true,
			message: "Utworzono zespół",
			data: savedTeam,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Get view of all teams
exports.getAllTeams = async (req, res) => {
	try {
		console.log("Jestem w kontrolerze");
		// Fetch all teams from the database
		const teams = await Team.find()
			.sort({ createdAt: -1 })
			.populate("teamLeaders members", "firstName lastName profilePic");

		res.status(200).json({
			success: true,
			message: "Pobrano zespoły",
			data: teams,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Get a team by ID
exports.getTeamById = async (req, res) => {
	try {
		const teamId = req.params.id;
		const team = await Team.findById(teamId).populate(
			"teamLeaders members",
			"firstName lastName email role"
		);

		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		res.status(200).json({
			success: true,
			message: "Pobrano zespół",
			data: team,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Edit a team by ID
exports.editTeam = async (req, res) => {
	try {
		const teamId = req.params.id;

		// const { error } = teamEditValidation.validate(req.body);
		// if (error)
		//   return res.status(400).json({ message: error.details[0].message });

		const updatedTeam = await Team.findByIdAndUpdate(teamId, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updatedTeam) {
			return res.status(404).json({ message: "Team not found" });
		}

		res.status(200).json({
			success: true,
			message: "Edytowano zespół",
			data: updatedTeam,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Delete a team by Id
exports.deleteTeam = async (req, res) => {
	try {
		const teamId = req.params.id;

		const team = await Team.findById(teamId);

		// If there are projects in team, forbid to delete team
		if (team.projects.length > 0) {
			return res
				.status(400)
				.json({ message: "Cannot delete team with active projects" });
		}
		// Delete associated calendar
		if (team.calendar) {
			await Calendar.findByIdAndDelete(team.calendar);
		}

		// Remove team from users' teams property
		await User.updateMany({ teams: teamId }, { $pull: { teams: teamId } });

		// Finally, delete the team
		const deletedTeam = await Team.findByIdAndDelete(teamId);

		if (!deletedTeam) {
			return res.status(404).json({ message: "Team not found" });
		}

		res
			.status(200)
			.json({ success: true, message: "Team deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Add a user to the team
exports.addMemberToTeam = async (req, res) => {
	try {
		const teamId = req.params.id; // Extract team ID from params
		const { searchKey } = req.body; // Extract search key from request body

		// Search for the user by name or email
		const user = await User.findOne({
			$or: [
				{ firstName: searchKey },
				{ lastName: searchKey },
				{ email: searchKey },
			],
		});
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Add the user to the team's members
		const updatedTeam = await Team.findByIdAndUpdate(
			teamId,
			{ $addToSet: { members: user._id } }, // $addToSet ensures uniqueness
			{ new: true }
		);

		if (!updatedTeam) {
			return res.status(404).json({ message: "Team not found" });
		}

		await User.findByIdAndUpdate(
			user._id,
			{ $addToSet: { teams: updatedTeam._id } },
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "Dodano członka zespołu",
			data: updatedTeam,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Remove user from a team
exports.removeMemberFromTeam = async (req, res) => {
	try {
		const teamId = req.params.id;
		const userId = req.body.userId; // Extract user ID from request body

		// Remove the user from the team's members
		const updatedTeam = await Team.findByIdAndUpdate(
			teamId,
			{ $pull: { members: userId } },
			{ new: true }
		);

		if (!updatedTeam) {
			return res.status(404).json({ message: "Team not found" });
		}

		//Tu by trzeba było dodać jakieś sprawdzanie czy np uzytkownik nie jest przypadkiem przypisany do jakichs projektow zadan itp

		await User.findByIdAndUpdate(
			userId,
			{ $pull: { teams: teamId } }, // Remove the team ID from the user's teams array
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "Usunięto członka zespołu ",
			data: updatedTeam,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Get members of a team
exports.getMembers = async (req, res) => {
	try {
		const teamId = req.params.id;

		// Fetch the team and populate the members
		const team = await Team.findById(teamId).populate(
			"members",
			"firstName lastName email"
		);

		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		res.status(200).json({
			success: true,
			message: "Pobrano członków",
			data: team.members,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
