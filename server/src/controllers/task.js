const Task = require("../models/task");
const Team = require("../models/team");
const Project = require("../models/project");
const moment = require("moment");

const taskCreateValidation = require("../utils/taskValidation");

// Controller to create a new task
exports.createTask = async (req, res) => {
	try {
		// const { error } = taskCreateValidation.validate(req.body);
		// if (error)
		// 	return res.status(400).json({ message: error.details[0].message });
		console.log("Body: ", req.body);
		console.log("projectId: ", req.params.projectId);
		console.log("creatorId: ", req.userId);
		const { name, description, priority, dueDate, memberIds } = req.body;
		const projectId = req.params.projectId;
		const creatorId = req.userId; //albo req.userId

		// Validate dueDate
		if (!moment(dueDate).isAfter(moment().startOf("day"))) {
			return res
				.status(400)
				.json({ message: "Due date must be a future date." });
		}

		// Retrieve the specified project and populate team members
		const project = await Project.findById(projectId).populate("team");
		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}

		// Retrieve the team associated with the project
		const team = await Team.findById(project.team);
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		// Include the creator's ID in the members list and filter validMemberIds
		const validMemberIds = new Set(memberIds);
		validMemberIds.add(creatorId); // Ensure the creator is always a member

		// Filter out any memberIds that are not part of the project's team
		const filteredMemberIds = Array.from(validMemberIds).filter(
			(memberId) =>
				project.members.includes(memberId) && team.members.includes(memberId)
		);

		// Create a new task with valid members
		const task = new Task({
			name,
			description,
			priority,
			dueDate,
			members: filteredMemberIds,
			createdBy: creatorId,
			project: projectId,
		});

		await task.save();

		// Add the task to the project's tasks array
		project.tasks.push(task._id);
		await project.save();

		res.status(200).json({
			success: true,
			message: "Stworzono zadanie",
			// data: task, // TUTAJ CHYBA data ci nie jest potrzebna, podobnie powinieneś zrobić w create projekt i innych takich - sprawdzać gdzie na froncie bierzesz tylko response.status, a gdzie response.data ci faktycznie jest potrzebne
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to get all tasks of a project
exports.getAllTasks = async (req, res) => {
	try {
		const { projectId } = req.params;

		// Retrieve all tasks of a project
		const project = await Project.findById(projectId).populate({
			path: "tasks",
			select: "name members createdAt createdBy dueDate",
			populate: [
				{
					path: "members",
					select: "profilePic", // Add additional fields you want to select here
				},
				{
					path: "createdBy",
					select: "firstName lastName", // Include profilePic here if needed
				},
			],
		});

		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}

		res.status(200).json({
			success: true,
			message: "Pobrano wszystkie zadania",
			data: project.tasks,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to get a task by ID
exports.getTaskById = async (req, res) => {
	try {
		const taskId = req.params.taskId;

		// Retrieve a task by ID and populate the 'members' and 'comments' fields
		const task = await Task.findById(taskId)
			.populate("members", "firstName lastName email createdAt")
			.populate("comments");

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		res.status(200).json({
			success: true,
			message: "Pobrano zadanie",
			data: task,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to edit a task
exports.editTask = async (req, res) => {
	try {
		const taskId = req.params.taskId;
		const { name, description, priority, dueDate, members } = req.body;

		const { error } = taskValidation.validate(name, description, dueDate);
		if (error)
			return res.status(400).json({ message: error.details[0].message });

		// Update a task by ID
		const task = await Task.findByIdAndUpdate(
			taskId,
			{ name, description, priority, dueDate, members },
			{ new: true }
		);

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		res.status(200).json({
			success: true,
			message: "Edytowano zadanie",
			data: task,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to delete a task
exports.deleteTask = async (req, res) => {
	try {
		const taskId = req.params.taskId;

		// Retrieve the task with its project ID
		const task = await Task.findById(taskId).select("project");
		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		// Delete the task
		await Task.findByIdAndDelete(taskId);

		// Remove the task from the project's tasks array
		await Project.findByIdAndUpdate(
			task.project,
			{ $pull: { tasks: taskId } },
			{ new: true }
		);

		res
			.status(200)
			.json({ success: true, message: "Task deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
