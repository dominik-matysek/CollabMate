const Comment = require("../models/comment");
const Task = require("../models/task");

const commentValidation = require("../utils/commentValidation");

// Controller to create a new comment
exports.createComment = async (req, res) => {
	try {
		const userId = req.userId;
		const { content } = req.body;

		const { error } = commentValidation.validate(content);
		if (error)
			return res.status(400).json({ message: error.details[0].message });

		const taskId = req.params.taskId; // Assuming your route parameter is taskId

		// Check if the user creating the comment is an assignee of the task
		const task = await Task.findById(taskId);

		if (!task) {
			return res.status(403).json({ error: "Nie znaleziono zadania." });
		}

		// Create a new comment
		const comment = new Comment({
			content,
			createdBy: userId,
		});

		await comment.save();

		// Add the comment to the task's comments array
		task.comments.push(comment._id);
		await task.save();

		res.status(200).json({
			success: true,
			message: "Dodano komentarz",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.getComments = async (req, res) => {
	try {
		const { taskId } = req.params;
		const task = await Task.findById(taskId).populate({
			path: "comments",
			select: "content createdBy createdAt",
			populate: {
				path: "createdBy",
				select: "firstName lastName profilePic",
			},
		});

		if (!task) {
			return res.status(404).json({ message: "Nie znaleziono zadania." });
		}

		res.status(200).json({
			success: true,
			comments: task.comments,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to delete a comment
exports.deleteComment = async (req, res) => {
	try {
		const { taskId, commentId } = req.params;
		const userId = req.userId;
		const userRole = req.userRole;

		// Find the comment by ID
		const comment = await Comment.findById(commentId);
		const task = await Task.findById(taskId);

		if (!comment) {
			return res.status(404).json({ error: "Nie znaleziono komentarza." });
		}

		if (!task) {
			return res.status(404).json({ error: "Nie znaleziono zadania." });
		}

		// Check if the user is the comment's author or a team leader
		const isAuthor = comment.createdBy.toString() === userId;
		const isTeamLeader = userRole === "TEAM LEADER"; // Assuming user role is stored in req.user

		if (!isAuthor && !isTeamLeader) {
			return res.status(403).json({ error: "Brak dostępu." });
		}

		// Delete the comment by ID
		await Comment.findByIdAndDelete(commentId);

		// Remove the comment from the task's comments array
		await Task.findByIdAndUpdate(
			taskId,
			{ $pull: { comments: commentId } },
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "Usunięto komentarz",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
