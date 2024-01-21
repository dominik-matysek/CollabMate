const express = require("express");
const router = express.Router();
const projects = require("../controllers/project");
const {
	verifyToken,
	verifyLeader,
	checkTeamAccess,
} = require("../middlewares/auth");

router.post(
	"/teams/:teamId/projects/create",
	verifyToken,
	verifyLeader,
	checkTeamAccess,
	projects.createProject
);

router.get(
	"/teams/:teamId/projects",
	verifyToken,
	checkTeamAccess,
	projects.getAllProjects
);

router.get(
	"/projects/:projectId",
	verifyToken,
	checkTeamAccess,
	projects.getProjectById
);

router.delete(
	"/projects/:projectId",
	verifyToken,
	verifyLeader,
	checkTeamAccess,
	projects.deleteProject
);

router.patch(
	"/projects/:projectId/add-member",
	verifyToken,
	verifyLeader,
	checkTeamAccess,
	projects.addMembersToProject
);

router.patch(
	"/projects/:projectId/remove-member",
	verifyToken,
	verifyLeader,
	checkTeamAccess,
	projects.removeMemberFromProject
);

router.patch(
	"/projects/:projectId/change-status",
	verifyToken,
	verifyLeader,
	checkTeamAccess,
	projects.changeProjectStatus
);

router.patch(
	"/projects/:projectId/change-description",
	verifyToken,
	verifyLeader,
	checkTeamAccess,
	projects.changeProjectDescription
);

module.exports = router;
