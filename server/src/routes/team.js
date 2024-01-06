const express = require("express");
const router = express.Router();
const teams = require("../controllers/team");
const { verifyToken, verifyAdmin } = require("../middlewares/auth");

router.post("/", verifyToken, verifyAdmin, teams.createTeam);

router.get("/", verifyToken, verifyAdmin, teams.getAllTeams);

router.get("/team/:id", verifyToken, teams.getTeamById);

router.post("/:id/edit", verifyToken, verifyAdmin, teams.editTeam);

router.delete("/:id", verifyToken, verifyAdmin, teams.deleteTeam);

router.post("/:id/add-member", verifyToken, verifyAdmin, teams.addMemberToTeam);

router.post(
  "/:id/remove-member",
  verifyToken,
  verifyAdmin,
  teams.removeMemberFromTeam
);

router.get("/:id/get-members", verifyToken, teams.getMembers);

router.get("/:id/get-projects", verifyToken, teams.getAllProjects);

module.exports = router;
