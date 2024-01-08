const express = require("express");
const router = express.Router();
const teams = require("../controllers/team");
const { verifyToken, verifyAdmin } = require("../middlewares/auth");

router.post("/teams", verifyToken, verifyAdmin, teams.createTeam);

router.get("/teams", verifyToken, teams.getAllTeams);

router.get("/teams/:id", verifyToken, teams.getTeamById);

router.patch("/teams/:id", verifyToken, verifyAdmin, teams.editTeam);

router.delete("/teams/:id", verifyToken, verifyAdmin, teams.deleteTeam);

router.patch(
	"/teams/:id/add-member",
	verifyToken,
	verifyAdmin,
	teams.addMemberToTeam
);

router.patch(
	"/teams/:id/remove-member",
	verifyToken,
	verifyAdmin,
	teams.removeMemberFromTeam
);

router.get("/teams/:id/get-members", verifyToken, teams.getMembers);

module.exports = router;
