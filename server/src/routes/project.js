const express = require("express");
const router = express.Router();
const projects = require("../controllers/project");
const verify = require("../middlewares/auth");
const { verifyLeader } = require("../middlewares/auth");

router.post("/:teamId/create", verify, verifyLeader, projects.createProject);

router.get("/:id", verify, projects.getProjectById);

router.post("/id/edit", verify, verifyLeader, projects.editProject);

router.delete("/:id", verify, verifyLeader, projects.deleteProject);

router.post(
	"/:id/add-member/:userId",
	verify,
	verifyLeader,
	projects.addMemberToProject
);

router.post(
	"/:id/remove-member/:userId",
	verify,
	verifyLeader,
	projects.removeMemberFromProject
);

router.get("/:id/get-tasks", verify, projects.getAllTasks);

module.exports = router;
