const express = require("express");
const router = express.Router();
const projects = require("../controllers/project");
const verify = require("../middlewares/auth");
const { verifyToken, verifyLeader } = require("../middlewares/auth");

router.post(
	"/:teamId/create",
	verifyToken,
	verifyLeader,
	projects.createProject
);

router.get("/:id", verifyToken, projects.getProjectById);

router.post("/id/edit", verifyToken, verifyLeader, projects.editProject);

router.delete("/:id", verifyToken, verifyLeader, projects.deleteProject);

router.post(
	"/:id/add-member/:userId",
	verifyToken,
	verifyLeader,
	projects.addMemberToProject
);

router.post(
	"/:id/remove-member/:userId",
	verifyToken,
	verifyLeader,
	projects.removeMemberFromProject
);

router.get("/:id/get-tasks", verifyToken, projects.getAllTasks);

module.exports = router;
