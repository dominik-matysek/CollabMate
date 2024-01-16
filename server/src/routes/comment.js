const express = require("express");
const router = express.Router();
const comments = require("../controllers/comment");
const {
	verifyToken,
	checkTaskAccess,
	checkTeamAccess,
} = require("../middlewares/auth");

router.get(
	"/:taskId/comments",
	verifyToken,
	checkTeamAccess,
	comments.getComments
);

router.post(
	"/:taskId/comments/create",
	verifyToken,
	checkTaskAccess,
	comments.createComment
);

router.delete(
	"/:taskId/comments/:commentId",
	verifyToken,
	checkTaskAccess,
	comments.deleteComment
);

module.exports = router;
