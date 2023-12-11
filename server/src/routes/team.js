const express = require("express");
const router = express.Router();
const teams = require("../controllers/team");
const verify = require("../middlewares/auth");

router.post("/create", verify, teams.createTeam);

router.get("/", verify, teams.getAllTeams);

router.get("/:id", verify, teams.getTeamById);

router.post("/:id/edit", verify, teams.editTeam);

router.delete("/:id", verify, teams.deleteTeam);

router.post("/:id/add-member/:userId", verify, teams.addMemberToTeam);

router.post("/:id/remove-member/:userId", verify, teams.removeMemberFromTeam);

router.get("/:id/get-members", verify, teams.getMembers);

router.get("/:id/get-projects", verify, teams.getAllProjects);

module.exports = router;
