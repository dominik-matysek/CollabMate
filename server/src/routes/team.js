const express = require("express");
const router = express.Router();
const teams = require("../controllers/team");
const {
	verifyToken,
	verifyAdmin,
	verifyAdminOrTeamMember,
} = require("../middlewares/auth");

router.post("/teams", verifyToken, verifyAdmin, teams.createTeam);

router.get("/teams", verifyToken, teams.getAllTeams);

router.get("/teams/:teamId", verifyToken, teams.getTeamById);

router.patch("/teams/:teamId", verifyToken, verifyAdmin, teams.editTeam);

router.delete("/teams/:teamId", verifyToken, verifyAdmin, teams.deleteTeam);

router.patch(
	"/teams/:teamId/add-members",
	verifyToken,
	verifyAdmin,
	teams.addUsersToTeam
);

router.patch(
	"/teams/:teamId/remove-member",
	verifyToken,
	verifyAdmin,
	teams.removeUserFromTeam
);

router.get(
	"/teams/:teamId/get-members",
	verifyToken,
	verifyAdminOrTeamMember,
	teams.getMembers
);

router.get(
	"/teams/:teamId/get-leaders",
	verifyToken,
	verifyAdminOrTeamMember,
	teams.getLeaders
);

module.exports = router;
