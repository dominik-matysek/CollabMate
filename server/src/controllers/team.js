const Team = require("../models/team");
const User = require("../models/user");
const Project = require("../models/project");

// Create a team
exports.createTeam = async (req, res) => {
	try {
		const { name, teamLeadId } = req.body;

		// Check if the specified team leader exists and has the correct role
		const teamLead = await User.findOne({
			_id: teamLeadId,
			role: { $ne: "ADMIN" },
		});
		if (!teamLead) {
			return res.status(400).json({ message: "Invalid team leader ID." });
		}

		// Create a new team
		const newTeam = new Team({
			name,
			teamLead: teamLead._id,
			members: [teamLead._id],
		});

		// Automatically create a calendar for the team
		const newCalendar = new Calendar({ team: newTeam._id });
		newTeam.calendar = newCalendar._id;

		// Save the team and the calendar
		const savedTeam = await newTeam.save();
		const savedCalendar = await newCalendar.save();

		// Update the team lead's "teams" property
		await User.findByIdAndUpdate(
			teamLeadId,
			{ $push: { teams: savedTeam._id } },
			{ new: true }
		);

		res
			.status(201)
			.json({ message: "Team created successfully.", team: savedTeam });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Get view of all teams
exports.getAllTeams = async (req, res) => {
	try {
		// Fetch all teams from the database
		const teams = await Team.find()
			.sort({ createdAt: -1 })
			.populate("teamLead members", "firstName lastName email");

		res.status(200).json(teams);
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
			"teamLead members",
			"firstName lastName email"
		);

		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		res.status(200).json(team);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Edit a team by ID
exports.editTeam = async (req, res) => {
	try {
		const teamId = req.params.id;

		const updatedTeam = await Team.findByIdAndUpdate(teamId, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updatedTeam) {
			return res.status(404).json({ message: "Team not found" });
		}

		res.status(200).json(updatedTeam);
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

		res.status(200).json({ message: "Team deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Add a user to the team
exports.addMemberToTeam = async (req, res) => {
	try {
		const teamId = req.params.id; // Extract team ID from params
		const { searchKey } = req.body; // New: Extract search key from request body

		// Search for the user by name or email
		const user = await User.findOne({
			$or: [{ name: searchKey }, { email: searchKey }],
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

		res.status(200).json({
			message: "Member added to the team successfully",
			team: updatedTeam,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Remove user from a team
