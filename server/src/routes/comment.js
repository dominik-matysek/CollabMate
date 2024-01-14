const express = require("express");
const router = express.Router();
const comments = require("../controllers/comment");
const { verifyToken, checkTaskAccess } = require("../middlewares/auth");

//tu może będziesz musiał przenieść getAllComments z task route itp

router.post(
	"/:taskId/comments/create",
	verifyToken,
	checkTaskAccess,
	comments.createComment
);

router.patch(
	"/:taskId/comments/:commentId",
	verifyToken,
	checkTaskAccess,
	comments.editComment
);

router.delete(
	"/:taskId/comments/:commentId",
	verifyToken,
	checkTaskAccess,
	comments.deleteComment
);

module.exports = router;
