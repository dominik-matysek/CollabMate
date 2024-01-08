const express = require("express");
const router = express.Router();
const projects = require("../controllers/project");
const verify = require("../middlewares/auth");
const { verifyToken, verifyLeader } = require("../middlewares/auth");

router.post(
	"/teams/:teamId/projects/create",
	verifyToken,
	verifyLeader,
	projects.createProject
);

router.get("/teams/:teamId/projects", verifyToken, projects.getAllProjects);

router.get("/projects/:id", verifyToken, projects.getProjectById);

router.patch("/projects/:id", verifyToken, verifyLeader, projects.editProject);

router.delete(
	"/projects/:id",
	verifyToken,
	verifyLeader,
	projects.deleteProject
);

router.patch(
	"/projects/:id/add-member/:userId",
	verifyToken,
	verifyLeader,
	projects.addMemberToProject
);

router.patch(
	"/projects/:id/remove-member/:userId",
	verifyToken,
	verifyLeader,
	projects.removeMemberFromProject
);

module.exports = router;
