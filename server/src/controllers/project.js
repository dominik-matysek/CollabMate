const Project = require("../models/project");
const Team = require("../models/team");
const Task = require("../models/task");
const Comment = require("../models/comment");

const projectCreateValidation = require("../utils/projectValidation");

// Create a new project
exports.createProject = async (req, res) => {
	try {
		const { error } = projectCreateValidation.validate(req.body);
		if (error)
			return res.status(400).json({ message: error.details[0].message });

		const { name, description, memberIds } = req.body;
		const teamId = req.params.teamId;

		// Fetch the team and validate memberIds
		const team = await Team.findById(teamId);
		if (!team) {
			return res.status(404).json({ error: "Nie znaleziono zespołu" });
		}

		// Filter memberIds to include only those who are part of the team
		const validMemberIds = memberIds.filter((memberId) =>
			team.members.includes(memberId)
		);

		// Check if there is at least one valid member
		if (validMemberIds.length === 0) {
			return res.status(400).json({
				error: "Przynajmniej jeden członek jest konieczny do projektu.",
			});
		}

		// Create a new project with valid members
		const project = new Project({
			name,
			description,
			members: validMemberIds,
			team: teamId,
		});
		await project.save();

		// Add the project to the team's projects array
		team.projects.push(project._id);
		await team.save();

		res.status(200).json({
			success: true,
			message: "Stworzono projekt",
			data: project,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get a project by ID
exports.getProjectById = async (req, res) => {
	try {
		const projectId = req.params.projectId;

		// Retrieve a project by ID
		const project = await Project.findById(projectId)
			.populate("tasks", "name status priority createdAt")
			.populate("members", "firstName lastName createdAt profilePic role");

		if (!project) {
			return res.status(404).json({ error: "Nie znaleziono projektu." });
		}

		res.status(200).json({
			success: true,
			message: "Pobrano projekt",
			data: project,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Delete a project
exports.deleteProject = async (req, res) => {
	try {
		const projectId = req.params.projectId;

		const project = await Project.findById(projectId);

		if (!project) {
			return res.status(404).json({ error: "Nie znaleziono projektu." });
		}

		// Check if there are tasks with status 'inProgress' or 'completed' in the project
		const activeTasks = await Task.find({
			project: projectId,
			status: { $in: ["inProgress", "completed"] },
		});

		if (activeTasks.length > 0) {
			return res.status(400).json({
				message:
					"Nie można usunąć projektu z zadaniami o statusie: aktywny, zakończony.",
			});
		}

		// Fetch all tasks associated with the project
		const tasks = await Task.find({ project: projectId });

		// Delete comments associated with each task, then delete the task
		for (const task of tasks) {
			await Comment.deleteMany({ _id: { $in: task.comments } });
			await Task.findByIdAndDelete(task._id);
		}

		// Delete the project
		await Project.findByIdAndDelete(projectId);

		// Remove the project from the team's projects array
		const team = await Team.findByIdAndUpdate(
			project.team,
			{ $pull: { projects: projectId } },
			{ new: true }
		);

		res
			.status(200)
			.json({ success: true, message: "Pomyślnie usunięto projekt." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to add a member to a project
exports.addMembersToProject = async (req, res) => {
	try {
		const projectId = req.params.projectId;
		const { userIds } = req.body; // Extract userId from request body

		// Find the project and populate the team reference
		const project = await Project.findById(projectId).populate(
			"team",
			"members"
		);

		if (!project) {
			return res.status(404).json({ error: "Nie znaleziono projektu." });
		}

		// Check if all users are members of the team associated with the project
		const areAllUsersTeamMembers = userIds.every((userId) =>
			project.team.members.includes(userId)
		);

		if (!areAllUsersTeamMembers) {
			return res
				.status(403)
				.json({ message: "Użytkownicy nie są członkami zespołu" });
		}

		// Add a member to the project
		const updatedProject = await Project.findByIdAndUpdate(
			projectId,
			{ $addToSet: { members: { $each: userIds } } },
			{ new: true }
		).populate("team", "members");

		res.status(200).json({
			success: true,
			message: "Dodano członków do projektu",
			data: updatedProject,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to remove a member from a project
exports.removeMemberFromProject = async (req, res) => {
	try {
		const projectId = req.params.projectId;
		const userId = req.body.memberId;

		// Check if the user is a member of any task in the project
		const taskWithMember = await Task.findOne({
			project: projectId,
			members: userId,
		});

		if (taskWithMember) {
			return res.status(400).json({
				error: "Użytkownik jest członkiem zadania. Najpierw usuń go z zadania.",
			});
		}

		// Remove a member from a project
		const project = await Project.findByIdAndUpdate(
			projectId,
			{ $pull: { members: userId } },
			{ new: true }
		);

		if (!project) {
			return res.status(404).json({ error: "Nie znaleziono projektu." });
		}

		res.status(200).json({
			success: true,
			message: "Usunięto członka z projektu",
			data: project,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get projects of a team
exports.getAllProjects = async (req, res) => {
	try {
		const { teamId } = req.params;

		const team = await Team.findById(teamId).populate({
			path: "projects",
			select: "name createdAt members status",
			populate: {
				path: "members",
				select: "profilePic",
			},
		});

		if (!team) {
			return res.status(404).json({ message: "Nie znaleziono zespołu." });
		}

		res.status(200).json({
			success: true,
			message: "Pobrano projekty",
			data: team.projects,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.changeProjectStatus = async (req, res) => {
	try {
		const { projectId } = req.params;
		const project = await Project.findById(projectId);

		if (!project) {
			return res.status(404).json({ message: "Nie znaleziono projektu" });
		}

		// Cycle through the statuses
		const nextStatus = {
			active: "completed",
			completed: "archived",
			archived: "active",
		};

		const newStatus = nextStatus[project.status] || "active";

		// Update the project status
		project.status = newStatus;
		await project.save();

		res.status(200).json({
			success: true,
			message: "Status projektu zaktualizowany pomyślnie",
			data: { status: newStatus },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

exports.changeProjectDescription = async (req, res) => {
	try {
		const { projectId } = req.params;
		const { description } = req.body;

		const result = await Project.updateOne(
			{ _id: projectId },
			{ $set: { description: description } }
		);

		if (result.nModified === 0) {
			return res
				.status(404)
				.json({
					message: "Nie znaleziono projektu lub opis nie został zmieniony.",
				});
		}

		res.status(200).json({
			success: true,
			message: "Opis projektu zaktualizowany pomyślnie",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
