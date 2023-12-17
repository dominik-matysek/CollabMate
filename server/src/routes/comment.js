const express = require("express");
const router = express.Router();
const comments = require("../controllers/comment");
const { verifyToken } = require("../middlewares/auth");

router.post("/:taskId/create", verifyToken, comments.createComment);

router.put("/:id/edit", verifyToken, comments.editComment);

router.delete("/:id", verifyToken, comments.deleteComment);

module.exports = router;
