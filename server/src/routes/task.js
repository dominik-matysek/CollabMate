const express = require("express");
const router = express.Router();
const tasks = require("../controllers/task");
const {
	verifyToken,
	checkTeamAccess,
	checkProjectAccess,
	checkTaskAccess,
} = require("../middlewares/auth");

router.post(
	"/projects/:projectId/tasks/create",
	verifyToken,
	checkProjectAccess,
	tasks.createTask
);

router.get(
	"/projects/:projectId/tasks",
	verifyToken,
	checkTeamAccess,
	tasks.getAllTasks
);

router.get("/tasks/:taskId", verifyToken, checkTeamAccess, tasks.getTaskById);

router.patch("/tasks/:taskId", verifyToken, checkTaskAccess, tasks.editTask);

router.delete("/tasks/:taskId", verifyToken, checkTaskAccess, tasks.deleteTask);

module.exports = router;
