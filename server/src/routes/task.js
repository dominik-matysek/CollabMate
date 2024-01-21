const express = require("express");
const router = express.Router();
const tasks = require("../controllers/task");
const { attachementStorage } = require("../config/cloudinary");
const multer = require("multer");

const uploadAttachment = multer({
	storage: attachementStorage,
	limits: { fileSize: 1024 * 1024 * 10 },
});

const {
	verifyToken,
	verifyCreator,
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

router.delete("/tasks/:taskId", verifyToken, verifyCreator, tasks.deleteTask);

router.patch(
	"/tasks/:taskId/add-member",
	verifyToken,
	verifyCreator,
	tasks.addMembersToTask
);

router.patch(
	"/tasks/:taskId/remove-member",
	verifyToken,
	verifyCreator,
	tasks.removeMemberFromTask
);

router.patch(
	"/tasks/:taskId/change-priority",
	verifyToken,
	verifyCreator,
	tasks.changeTaskPriority
);

router.patch(
	"/tasks/:taskId/change-status",
	verifyToken,
	verifyCreator,
	tasks.changeTaskStatus
);

router.patch(
	"/tasks/:taskId/change-description",
	verifyToken,
	verifyCreator,
	tasks.changeTaskDescription
);

router.post(
	"/tasks/:taskId/upload-attachments",
	verifyToken,
	checkTaskAccess,
	uploadAttachment.array("file", 5),
	tasks.uploadAttachments
);

router.delete(
	"/tasks/:taskId/remove-attachment",
	verifyToken,
	checkTaskAccess,
	tasks.removeAttachment
);

module.exports = router;
