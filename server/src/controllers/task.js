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

		// Check if the user creating the task is a member of the project
		const project = await Project.findOne({
			_id: projectId,
			members: req.user._id,
		});
		if (!project) {
			return res
				.status(403)
				.json({ error: "User is not a member of the project" });
		}

		// Create a new task
		const task = new Task({
			name,
			description,
			priority,
			dueDate,
			members: [req.user._id],
			createdBy: req.user._id,
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
			"createdAt"
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
		const taskId = req.params.id;

		// Retrieve a task by ID and populate the 'members' and 'comments' fields
		const task = await Task.findById(taskId)
			.populate("members", "firstName lastName email createdAt")
			.populate("comments");

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		// Check if the user accessing the task is a member of the project
		const project = await Project.findOne({
			tasks: taskId,
			members: req.user._id,
		});
		if (!project) {
			return res
				.status(403)
				.json({ error: "User is not a member of the project" });
		}

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

// Controller to edit a task
exports.editTask = async (req, res) => {
	try {
		const taskId = req.params.id;
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

		// Check if the user editing the task is a member of the project
		const project = await Project.findOne({
			tasks: taskId,
			members: req.user._id,
		});

		if (!project) {
			return res
				.status(403)
				.json({ error: "User is not a member of the project" });
		}

		// Check if the user is one of the members of the task
		const taskMembers = task.members.map((assignee) => assignee.toString());
		if (!taskMembers.includes(req.user._id.toString())) {
			return res
				.status(403)
				.json({ error: "User is not an assignee of the task" });
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
		const taskId = req.params.id;

		// Delete a task by ID
		const deletedTask = await Task.findByIdAndDelete(taskId);

		if (!deletedTask) {
			return res.status(404).json({ error: "Task not found" });
		}

		// Remove the task from the project's tasks array
		const project = await Project.findByIdAndUpdate(
			req.project._id,
			{ $pull: { tasks: taskId } },
			{ new: true }
		);

		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}

		// Check if the user is one of the members of the task
		const taskMembers = task.members.map((assignee) => assignee.toString());
		if (!taskMembers.includes(req.user._id.toString())) {
			return res
				.status(403)
				.json({ error: "User is not an assignee of the task" });
		}

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
		const taskId = req.params.id;

		// Retrieve comments of a task
		const task = await Task.findById(taskId).populate("comments");

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		// Check if the user accessing the comments is a member of the project
		const project = await Project.findOne({
			tasks: taskId,
			members: req.user._id,
		});
		if (!project) {
			return res
				.status(403)
				.json({ error: "User is not a member of the project" });
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
