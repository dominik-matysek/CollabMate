const express = require("express");
const router = express.Router();
const comments = require("../controllers/comment");
const verify = require("../middlewares/auth");

router.post("/:taskId/create", verify, comments.createComment);

router.put("/:id/edit", verify, comments.editComment);

router.delete("/:id", verify, comments.deleteComment);

module.exports = router;
