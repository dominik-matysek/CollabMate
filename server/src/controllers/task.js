const Task = require("../models/task");
const Project = require("../models/project");

const taskValidation = require("../utils/taskValidation");

// Controller to create a new task
exports.createTask = async (req, res) => {
	try {
		const { error } = taskValidation.validate(req.body);
		if (error)
			return res.status(400).json({ message: error.details[0].message });

		const { name, description, priority, dueDate, members } = req.body;
		const projectId = req.params.projectId;

		// Retrieve the specified project
		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({ message: "Project not found" });
		}

		// Create a new task
		const task = new Task({
			name,
			description,
			priority,
			dueDate,
			members: members || [],
			createdBy: req.user._id,
			project: projectId,
		});

		await task.save();

		// Add the task to the project's tasks array
		project.tasks.push(task._id);
		await project.save();

		res.status(200).json({
			success: true,
			message: "Stworzono zadanie",
			data: task,
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
		const project = await Project.findById(projectId).populate(
			"tasks",
			"name status members createdAt"
		);

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

// Controller to get comments of a task
exports.getComments = async (req, res) => {
	try {
		const taskId = req.params.taskId;

		// Retrieve comments of a task
		const task = await Task.findById(taskId).populate("comments");

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		res.status(200).json({
			success: true,
			message: "Pobrano komentarze",
			data: task.comments,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
