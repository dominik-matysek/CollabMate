const Comment = require("../models/comment");
const Task = require("../models/task");

// Controller to create a new comment
exports.createComment = async (req, res) => {
	try {
		const { content } = req.body;
		const taskId = req.params.taskId; // Assuming your route parameter is taskId

		// Check if the user creating the comment is an assignee of the task
		const task = await Task.findOne({
			_id: taskId,
			assignees: req.user._id,
		});

		if (!task) {
			return res
				.status(403)
				.json({ error: "User is not an assignee of the task" });
		}

		// Create a new comment
		const comment = new Comment({
			content,
			createdBy: req.user._id,
		});

		await comment.save();

		// Add the comment to the task's comments array
		task.comments.push(comment._id);
		await task.save();

		res.status(201).json({ comment });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to delete a comment
exports.deleteComment = async (req, res) => {
	try {
		const commentId = req.params.id;

		// Find the comment by ID
		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({ error: "Comment not found" });
		}

		// Check if the user deleting the comment is the creator of the comment
		if (comment.createdBy.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ error: "User is not the creator of the comment" });
		}

		// Delete the comment by ID
		const deletedComment = await Comment.findByIdAndDelete(commentId);

		if (!deletedComment) {
			return res.status(404).json({ error: "Comment not found" });
		}

		// Remove the comment from the task's comments array
		const task = await Task.findByIdAndUpdate(
			req.task._id,
			{ $pull: { comments: commentId } },
			{ new: true }
		);

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Controller to edit a comment
exports.editComment = async (req, res) => {
	try {
		const commentId = req.params.id;
		const { content } = req.body;

		// Update a comment by ID
		const comment = await Comment.findByIdAndUpdate(
			commentId,
			{ content },
			{ new: true }
		);

		if (!comment) {
			return res.status(404).json({ error: "Comment not found" });
		}

		// Check if the user editing the comment is the creator of the comment
		if (comment.createdBy.toString() !== req.user._id.toString()) {
			return res
				.status(403)
				.json({ error: "User is not the creator of the comment" });
		}

		res.status(200).json({ comment });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
