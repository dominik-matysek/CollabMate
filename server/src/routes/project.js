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
); //CZŁONEK ZESPOŁU

router.get("/teams/:teamId/projects", verifyToken, projects.getAllProjects); //CZŁONEK ZESPOŁU

router.get("/projects/:id", verifyToken, projects.getProjectById); //CZŁONEK ZESPOŁU

router.patch("/projects/:id", verifyToken, verifyLeader, projects.editProject); //CZŁONEK ZESPOŁU

router.delete(
	"/projects/:id",
	verifyToken,
	verifyLeader,
	projects.deleteProject
); //CZŁONEK ZESPOŁU

router.patch(
	"/projects/:id/add-member",
	verifyToken,
	verifyLeader,
	projects.addMemberToProject
); //CZŁONEK ZESPOŁU

router.patch(
	"/projects/:id/remove-member",
	verifyToken,
	verifyLeader,
	projects.removeMemberFromProject
); //CZŁONEK ZESPOŁU

module.exports = router;
