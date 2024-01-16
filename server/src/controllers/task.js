const Task = require("../models/task");
const Team = require("../models/team");
const Project = require("../models/project");
const moment = require("moment");
const { getAllowedStatusTransitions } = require("../utils/allowedStatus");
const { deleteFile } = require("../config/cloudinary");

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
		const userId = req.userId;
		const userRole = req.userRole;
		console.log(userRole);

		// Retrieve a task by ID and populate the 'members' and 'comments' fields
		const task = await Task.findById(taskId).populate(
			"members",
			"firstName lastName profilePic role"
		);

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		if (new Date() > new Date(task.dueDate) && task.status !== "overdue") {
			task.status = "overdue";
			await task.save();
		}

		const allowedTransitions = getAllowedStatusTransitions(
			task.status,
			userRole
		);

		console.log("allowedTransitions: ", allowedTransitions);

		res.status(200).json({
			success: true,
			message: "Pobrano zadanie",
			data: task,
			allowedTransitions,
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

exports.addMembersToTask = async (req, res) => {
	try {
		const taskId = req.params.taskId;
		const { userIds } = req.body;

		const task = await Task.findById(taskId).populate("project", "members");

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		const alreadyMembers = userIds.filter((userId) =>
			task.members.includes(userId)
		);

		if (alreadyMembers.length > 0) {
			return res.status(400).json({
				error: "One or more users are already members of the task",
			});
		}
		const areAllUsersProjectMembers = userIds.every((userId) =>
			task.project.members.includes(userId)
		);

		if (!areAllUsersProjectMembers) {
			return res
				.status(403)
				.json({ message: "One or more users are not members of the project" });
		}

		const updatedTask = await Task.findByIdAndUpdate(
			taskId,
			{ $addToSet: { members: { $each: userIds } } }, // $addToSet ensures no duplicates
			{ new: true }
		).populate("project", "members");

		res.status(200).json({
			success: true,
			message: "Dodano członków do zadania",
			data: updatedTask,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.removeMemberFromTask = async (req, res) => {
	try {
		const taskId = req.params.taskId;
		const userId = req.body.memberId;

		// Remove a member from a project
		const task = await Task.findByIdAndUpdate(
			taskId,
			{ $pull: { members: userId } },
			{ new: true }
		);

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		res.status(200).json({
			success: true,
			message: "Usunięto członka z zadania",
			data: task,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.changeTaskPriority = async (req, res) => {
	try {
		const { taskId } = req.params;
		const task = await Task.findById(taskId);
		// console.log("User: ", req.userId);

		if (!task) {
			return res.status(404).json({ message: "Nie znaleziono projektu" });
		}

		// Cycle through the statuses
		const nextPriority = {
			low: "medium",
			medium: "high",
			high: "low",
		};

		const newPriority = nextPriority[task.priority] || "medium";

		// Update the project status
		task.priority = newPriority;

		console.log("Priorytet:", task.priority);

		await task.save();

		res.status(200).json({
			success: true,
			message: "Priorytet zadania zaktualizowany pomyślnie",
			data: { priority: newPriority },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.changeTaskStatus = async (req, res) => {
	try {
		const { taskId } = req.params;
		const userId = req.userId;
		const userRole = req.userRole;
		const newStatus = req.body.status;

		console.log("Wysłany status: ", newStatus);
		const task = await Task.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		const allowedTransitions = getAllowedStatusTransitions(
			task.status,
			userRole
		);

		console.log("To mozesz: ", allowedTransitions);

		if (!allowedTransitions.includes(newStatus)) {
			return res.status(400).json({ message: "Invalid status transition" });
		}

		task.status = newStatus;

		await task.save();

		res.status(200).json({
			success: true,
			message: "Task status updated successfully",
			data: { status: task.status },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.changeTaskDescription = async (req, res) => {
	try {
		const { taskId } = req.params;
		const { description } = req.body;

		console.log("Tym razem zmiana opisu - ID: ", taskId);
		console.log("Tym razem zmiana opisu: ", description);

		const result = await Task.updateOne(
			{ _id: taskId },
			{ $set: { description: description } }
		);

		if (result.nModified === 0) {
			return res
				.status(404)
				.json({ message: "Task not found or description unchanged" });
		}

		res.status(200).json({
			success: true,
			message: "Opis zadania zaktualizowany pomyślnie",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// I jeszcze ogarnięcie attachements
exports.uploadAttachments = async (req, res) => {
	try {
		const { taskId } = req.params;

		const task = await Task.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		if (req.files) {
			req.files.forEach((file) => {
				const fileUrl = file.path;
				task.attachments.push(fileUrl);
				console.log("Original file name: ", file.originalname);
			});
		}

		await task.save();

		res.status(200).json({
			success: true,
			message: "Attachment uploaded successfully",
			data: { attachmentUrls: task.attachments },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.removeAttachment = async (req, res) => {
	try {
		const { taskId } = req.params;
		const attachmentUrl = decodeURIComponent(req.query.url);

		console.log("Attachment: ", req.params);

		// Update the task and remove the attachment
		const updatedTask = await Task.findByIdAndUpdate(
			taskId,
			{ $pull: { attachments: attachmentUrl } },
			{ new: true } // Return the updated document
		);

		if (!updatedTask) {
			return res
				.status(404)
				.json({ message: "Task not found or attachment not removed" });
		}

		// Extract publicId and use utility function to delete from Cloudinary
		const publicId = `CollabMate/Attachments/${
			attachmentUrl.split("/").pop().split(".")[0]
		}`;
		const { success, error } = await deleteFile(publicId);

		if (!success) {
			return res
				.status(500)
				.json({ error: "Error deleting image from Cloudinary" });
		}

		res.status(200).json({
			success: true,
			message: "Attachment removed successfully",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
