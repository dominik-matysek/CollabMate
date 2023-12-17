const express = require("express");
const router = express.Router();
const tasks = require("../controllers/task");
const { verifyToken } = require("../middlewares/auth");

router.post("/:projectId/create", verifyToken, tasks.createTask);

router.get("/:id", verifyToken, tasks.getTaskById);

router.post("/:id/edit", verifyToken, tasks.editTask);

router.delete("/:id", verifyToken, tasks.deleteTask);

router.get("/:id/get-comments", verifyToken, tasks.getComments);

module.exports = router;
