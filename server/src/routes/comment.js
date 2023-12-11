const express = require("express");
const router = express.Router();
const comments = require("../controllers/comment");
const verify = require("../middlewares/auth");

router.post("/create", verify, comments.createComment);

router.delete("/:id", verify, comments.deleteComment);

module.exports = router;
