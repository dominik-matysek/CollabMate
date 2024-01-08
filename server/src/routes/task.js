const express = require("express");
const router = express.Router();
const tasks = require("../controllers/task");
const { verifyToken } = require("../middlewares/auth");

router.post("/projects/:projectId/tasks/create", verifyToken, tasks.createTask);

router.get("/projects/:projectId/tasks", verifyToken, tasks.getAllTasks);

router.get("/tasks/:id", verifyToken, tasks.getTaskById);

router.patch("/tasks/:id", verifyToken, tasks.editTask);

router.delete("/tasks/:id", verifyToken, tasks.deleteTask);

router.get("/tasks/:id/comments", verifyToken, tasks.getComments); //probably niepotrzebne

module.exports = router;
