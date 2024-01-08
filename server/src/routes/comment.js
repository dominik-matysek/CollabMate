const express = require("express");
const router = express.Router();
const comments = require("../controllers/comment");
const { verifyToken } = require("../middlewares/auth");

router.post("/:taskId/comments/create", verifyToken, comments.createComment);

router.patch("/:taskId/comments/:commentId", verifyToken, comments.editComment);

router.delete(
	"/:taskId/comments/commentId",
	verifyToken,
	comments.deleteComment
);

module.exports = router;
