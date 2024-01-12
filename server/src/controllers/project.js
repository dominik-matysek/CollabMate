const Project = require("../models/project");
const Team = require("../models/team");
const User = require("../models/user");

const projectCreateValidation = require("../utils/projectValidation");

// Create a new project
exports.createProject = async (req, res) => {
	try {
		const { error } = projectCreateValidation.validate(req.body);
		if (error)
			return res.status(400).json({ message: error.details[0].message });

		const { name, description, memberIds } = req.body;
		console.log("Siema");
		const teamId = req.params.teamId;

		console.log(teamId);

		// Fetch the team and validate memberIds
		const team = await Team.findById(teamId);
		if (!team) {
			return res.status(404).json({ error: "Team not found" });
		}

		// Filter memberIds to include only those who are part of the team
		const validMemberIds = memberIds.filter((memberId) =>
			team.members.includes(memberId)
		);

		// Check if there is at least one valid member
		if (validMemberIds.length === 0) {
			return res.status(400).json({
				error: "At least one team member is required for the project.",
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
			.populate("members", "firstName lastName email createdAt profilePic");

		if (!project) {
			return res.status(404).json({ error: "Project not found" });
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

// Edit a project
exports.editProject = async (req, res) => {
	try {
		const projectId = req.params.projectId;
		const { name, description, status } = req.body;

		// const { error } = projectValidation.validate(name, description);
		// if (error)
		// 	return res.status(400).json({ message: error.details[0].message });

		// Update a project by ID
		const project = await Project.findByIdAndUpdate(
			projectId,
			{ name, description, status },
			{ new: true }
		);

		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}

		res.status(200).json({
			success: true,
			message: "Edytowano projekt",
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

		// If there are tasks in project, forbid to delete project
		if (project.tasks.length > 0) {
			return res
				.status(400)
				.json({ message: "Cannot delete project with active tasks" });
		}

		const deletedProject = await Project.findByIdAndDelete(projectId);

		if (!deletedProject) {
			return res.status(404).json({ error: "Project not found" });
		}

		// Remove the project from the team's projects array
		const team = await Team.findByIdAndUpdate(
			req.team._id,
			{ $pull: { projects: projectId } },
			{ new: true }
		);

		if (!team) {
			return res.status(404).json({ error: "Team not found" });
		}

		res
			.status(200)
			.json({ success: true, message: "Project deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to add a member to a project
exports.addMemberToProject = async (req, res) => {
	try {
		const projectId = req.params.projectId;
		const { userId } = req.body; // Extract userId from request body

		// Find the project and populate the team reference
		const project = await Project.findById(projectId).populate(
			"team",
			"members"
		);

		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}

		// Check if the user is a member of the team associated with the project
		if (!project.team.members.includes(userId)) {
			return res
				.status(403)
				.json({ message: "User is not a member of the team" });
		}

		// Add a member to the project
		const updatedProject = await Project.findByIdAndUpdate(
			projectId,
			{ $addToSet: { members: userId } }, // $addToSet ensures no duplicates
			{ new: true }
		).populate("team", "members");

		res.status(200).json({
			success: true,
			message: "Dodano członka do projektu",
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
		const userId = req.params.userId;

		// Remove a member from a project
		const project = await Project.findByIdAndUpdate(
			projectId,
			{ $pull: { members: userId } },
			{ new: true }
		);

		if (!project) {
			return res.status(404).json({ error: "Project not found" });
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
				select: "profilePic", // Add additional fields you want to select here
			},
		});

		if (!team) {
			return res.status(404).json({ message: "Team not found" });
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
