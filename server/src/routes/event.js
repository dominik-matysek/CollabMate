const express = require("express");
const router = express.Router();
const events = require("../controllers/event");
const {
	verifyToken,
	checkTeamAccess,
	verifyEventCreator,
} = require("../middlewares/auth");

router.post(
	"teams/:teamId/events",
	verifyToken,
	checkTeamAccess,
	events.createEvent
);

router.get(
	"teams/:teamId/events",
	verifyToken,
	checkTeamAccess,
	events.getAllEvents
);

router.get(
	"events/:eventId",
	verifyToken,
	checkTeamAccess,
	events.getEventById
);

router.patch(
	"events/:eventId",
	verifyToken,
	verifyEventCreator,
	events.editEvent
);

router.delete(
	"events/:eventId",
	verifyToken,
	verifyEventCreator,
	events.deleteEvent
);

router.patch(
	"/events/:eventId/add-member",
	verifyToken,
	verifyEventCreator,
	events.addMembersToEvent
);

router.patch(
	"/events/:eventId/remove-member",
	verifyToken,
	verifyEventCreator,
	events.removeMemberFromEvent
);

module.exports = router;
