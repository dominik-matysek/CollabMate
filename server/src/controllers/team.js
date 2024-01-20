const Team = require("../models/team");
const Project = require("../models/project");
const Task = require("../models/task");
const Comment = require("../models/comment");
const Event = require("../models/event");
const User = require("../models/user");
const teamCreateValidation = require("../utils/teamValidation");

// Create a team
exports.createTeam = async (req, res) => {
	try {
		console.log("Tworzenie teamu");

		const { name, teamLeadIds } = req.body;

		console.log("A co to: ", teamLeadIds);

		// const { error } = teamCreateValidation.validate(req.body);
		// if (error) {
		// 	return res.status(400).json({
		// 		message: "Validation error",
		// 		details: error.details.map((detail) => detail.message),
		// 	});
		// }

		console.log("Ile leadów: ", teamLeadIds.length);

		// Check if the specified team leader exists and are not admins or already in team
		const teamLeads = await User.find({
			_id: { $in: teamLeadIds },
			role: { $ne: "ADMIN" },
			// team: {$or{$exists: false, null} },
			$or: [{ team: { $exists: false } }, { team: null }],
		});

		console.log("Ile leadów teraz: ", teamLeads.length);

		if (teamLeads.length !== teamLeadIds.length) {
			return res.status(400).json({
				message:
					"Invalid team leaders: Do not exist, are admins, or are already part of a team",
			});
		}

		// let members = [];

		// if (memberIds && memberIds.length) {
		// 	members = await User.find({
		// 		_id: { $in: memberIds },
		// 		role: { $ne: "ADMIN" },
		// 		team: { $exists: false },
		// 	});
		// 	if (members.length !== memberIds.length) {
		// 		return res
		// 			.status(400)
		// 			.json({ message: "One or more members are invalid." });
		// 	}
		// }

		// Create a new team
		const newTeam = new Team({
			name,
			teamLeaders: teamLeads.map((lead) => lead._id),
		});

		const savedTeam = await newTeam.save();

		const teamLeadUpdates = teamLeads.map((lead) => {
			return User.findByIdAndUpdate(lead._id, {
				$set: { team: savedTeam._id, role: "TEAM LEADER" },
			});
		});

		await Promise.all(teamLeadUpdates);

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
			.populate(
				"teamLeaders members",
				"firstName lastName profilePic createdAt"
			);

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
		const teamId = req.params.teamId;
		const team = await Team.findById(teamId).populate(
			"teamLeaders members",
			"firstName lastName email role profilePic createdAt"
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
		const teamId = req.params.teamId;

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
		const teamId = req.params.teamId;

		const team = await Team.findById(teamId);

		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		const activeProjects = await Project.find({
			team: teamId,
			status: "active",
		});
		if (activeProjects.length > 0) {
			return res
				.status(400)
				.json({ message: "Cannot delete team with active projects" });
		}

		// Delete associated projects and their tasks, comments
		const projects = await Project.find({ team: teamId });
		for (const project of projects) {
			const tasks = await Task.find({ project: project._id });
			for (const task of tasks) {
				await Comment.deleteMany({ _id: { $in: task.comments } });
				await Task.findByIdAndDelete(task._id);
			}
			await Project.findByIdAndDelete(project._id);
		}

		// Delete associated events
		await Event.deleteMany({ _id: { $in: team.events } });

		// Update role of team leaders to 'EMPLOYEE'
		await User.updateMany(
			{ _id: { $in: team.teamLeaders }, role: "TEAM LEADER" },
			{ $set: { role: "EMPLOYEE" } }
		);

		// Remove team from users' teams property
		await User.updateMany({ team: teamId }, { $set: { team: null } });

		// Finally, delete the team
		await Team.findByIdAndDelete(teamId);

		res
			.status(200)
			.json({ success: true, message: "Team deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.addUsersToTeam = async (req, res) => {
	try {
		const { userIds, roleType } = req.body; // roleType can be 'member' or 'leader'
		const teamId = req.params.teamId; // Extract team ID from params

		// Check if the team exists
		const team = await Team.findById(teamId);
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		// Fetch users based on the provided IDs
		const users = await User.find({ _id: { $in: userIds } });

		// Check if all user IDs exist
		if (users.length !== userIds.length) {
			return res.status(400).json({ message: "Some user IDs do not exist" });
		}

		// Filter out invalid users (admins or already in a team)
		const invalidUsers = users.filter(
			(user) => user.role === "ADMIN" || user.team
		);
		if (invalidUsers.length > 0) {
			const invalidUserDetails = invalidUsers.map((user) => {
				return { id: user._id, role: user.role, alreadyInTeam: !!user.team };
			});
			return res.status(400).json({
				message:
					"Niektórzy użytkownicy nie spełniają wymagań: 1. Użytkownik nie może być adminem 2. Użytkownik nie może należeć do innego zespołu 3. Użytownik musi istnieć w systemie",
				invalidUsers: invalidUserDetails,
			});
		}

		// Update team based on role type
		let teamUpdate = {};
		if (roleType === "TEAM LEADER") {
			teamUpdate = { $addToSet: { teamLeaders: { $each: userIds } } };
		} else {
			teamUpdate = { $addToSet: { members: { $each: userIds } } };
		}

		// Update team in the database
		const updatedTeam = await Team.findByIdAndUpdate(teamId, teamUpdate, {
			new: true,
		});

		// Update users' team and role
		for (let userId of userIds) {
			if (roleType === "TEAM LEADER") {
				await User.findByIdAndUpdate(userId, {
					team: teamId,
					role: "TEAM LEADER",
				});
			} else {
				await User.findByIdAndUpdate(userId, {
					team: teamId,
				});
			}
		}

		res.status(200).json({
			success: true,
			message: "Users added successfully to the team",
			data: updatedTeam,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Add a user to the team
// exports.addUsersToTeam = async (req, res) => {
// 	try {
// 		const { userIds, roleType } = req.body; // roleType can be 'member' or 'leader'
// 		const teamId = req.params.id; // Extract team ID from params
// 		console.log("Id userów do dodania", userIds);

// 		const team = await Team.findById(teamId);
// 		if (!team) {
// 			return res.status(404).json({ message: "Team not found" });
// 		}

// 		console.log(team);

// 		// const users = await User.find({ _id: { $in: userIds } });

// 		// if (users.length !== userIds.length) {
// 		// 	return res.status(400).json({ message: "Some user IDs do not exist" });
// 		// }

// 		// const invalidUsers = users.filter(
// 		// 	(user) => user.role === "ADMIN" || user.team
// 		// );
// 		// if (invalidUsers.length > 0) {
// 		// 	const invalidUserDetails = invalidUsers.map((user) => {
// 		// 		return { id: user._id, role: user.role, alreadyInTeam: !!user.team };
// 		// 	});
// 		// 	return res.status(400).json({
// 		// 		message: "Some users are invalid, already in a team, or are admins",
// 		// 		invalidUsers: invalidUserDetails,
// 		// 	});
// 		// }

// 		// Filter out invalid user IDs or users already in a team
// 		const validUsers = await User.find({
// 			_id: { $in: userIds },
// 			role: { $ne: "ADMIN" },
// 			team: { $exists: false },
// 		});

// 		console.log("Valid users", validUsers);

// 		if (validUsers.length !== userIds.length) {
// 			return res.status(400).json({
// 				message: "Some users are invalid, already in a team, or are admins",
// 			});
// 		}

// 		// Perform updates based on roleType
// 		if (roleType === "TEAM LEADER") {
// 			team.teamLeaders.push(...validUsers.map((user) => user._id));
// 			await User.updateMany(
// 				{ _id: { $in: validUsers.map((user) => user._id) } },
// 				{ team: teamId, role: "TEAM LEADER" }
// 			);
// 		} else {
// 			team.members.push(...validUsers.map((user) => user._id));
// 			await User.updateMany(
// 				{ _id: { $in: validUsers.map((user) => user._id) } },
// 				{ team: teamId }
// 			);
// 		}

// 		await team.save();

// 		res.status(200).json({
// 			success: true,
// 			message: "Dodano członka zespołu",
// 			// data: team,
// 		});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Internal Server Error" });
// 	}
// };

// Remove user from a team
exports.removeUserFromTeam = async (req, res) => {
	try {
		const teamId = req.params.teamId;
		console.log(teamId);
		const userId = req.body.memberId; // Extract user ID from request body
		console.log(userId);

		const team = await Team.findById(teamId)
			.populate({
				path: "projects",
				populate: { path: "members" },
			})
			.populate("teamLeaders", "role");

		if (!team) {
			return res.status(404).json({ message: "Nie znaleziono zespołu" });
		}

		// Check if user is part of any project within the team
		const isUserInProject = team.projects.some((project) =>
			project.members.some((member) => member._id.toString() === userId)
		);

		if (isUserInProject) {
			return res.status(400).json({
				message:
					"Użytkownik jest przypisany do projektu. Zadbaj o to, żeby został z niego usunięty.",
			});
		}

		// Ensure at least one team leader remains
		if (
			team.teamLeaders.some((leader) => leader._id.toString() === userId) &&
			team.teamLeaders.length <= 1
		) {
			return res
				.status(400)
				.json({ message: "Zespół musi posiadać przynajmniej jednego lidera." });
		}

		// Remove the user from the team
		await Team.findByIdAndUpdate(teamId, {
			$pull: { members: userId, teamLeaders: userId },
		});

		// Change role back to EMPLOYEE if removed user is a team leader
		if (team.teamLeaders.some((leader) => leader._id.toString() === userId)) {
			await User.findByIdAndUpdate(userId, {
				$set: { role: "EMPLOYEE", team: null },
			});
		} else {
			await User.findByIdAndUpdate(userId, { $set: { team: null } });
		}

		res.status(200).json({
			success: true,
			message: "Usunięto członka zespołu ",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Get members of a team
exports.getMembers = async (req, res) => {
	try {
		const teamId = req.params.teamId;

		// Fetch the team and populate the members
		const team = await Team.findById(teamId).populate(
			"members",
			"firstName lastName email createdAt role profilePic"
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

// Get leaders of a team
exports.getLeaders = async (req, res) => {
	try {
		const teamId = req.params.teamId;

		// Fetch the team and populate the members
		const team = await Team.findById(teamId).populate(
			"teamLeaders",
			"firstName lastName email createdAt profilePic role"
		);

		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		res.status(200).json({
			success: true,
			message: "Pobrano liderów",
			data: team.teamLeaders,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
