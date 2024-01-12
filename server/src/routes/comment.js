const express = require("express");
const router = express.Router();
const comments = require("../controllers/comment");
const { verifyToken } = require("../middlewares/auth");

router.post("/:taskId/comments/create", verifyToken, comments.createComment); // CZŁONKE ZESPOŁU + CZŁONEK PROJEKTU + CZŁONEK ZADANIA / NO CHYBA ŻE TEAM LEADER

router.patch("/:taskId/comments/:commentId", verifyToken, comments.editComment); // CZŁONKE ZESPOŁU + CZŁONEK PROJEKTU + CZŁONEK ZADANIA / NO CHYBA ŻE TEAM LEADER

router.delete(
	"/:taskId/comments/commentId",
	verifyToken,
	comments.deleteComment
); // CZŁONKE ZESPOŁU + CZŁONEK PROJEKTU + CZŁONEK ZADANIA / NO CHYBA ŻE TEAM LEADER

module.exports = router;
