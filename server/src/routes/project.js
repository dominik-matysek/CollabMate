const express = require("express");
const router = express.Router();
const projects = require("../controllers/project");
const verify = require("../middlewares/auth");

router.post("/create", verify, projects.createProject);

router.get("/:id", verify, projects.getprojectById);

router.post("/:id/edit", verify, projects.editProject);

router.delete("/:id", verify, projects.deleteProject);

router.post("/:id/add-member/:userId", verify, projects.addMemberToProject);

router.post(
  "/:id/remove-member/:userId",
  verify,
  projects.removeMemberFromProject
);

router.get("/:id/get-tasks", verify, projects.getAllTasks);

module.exports = router;
