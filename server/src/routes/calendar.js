const express = require("express");
const router = express.Router();
const calendars = require("../controllers/calendar");
const { verifyToken, checkTeamAccess } = require("../middlewares/auth");

router.post(
	"teams/:teamId/calendar/create-event",
	verifyToken,
	checkTeamAccess,
	calendars.createEvent
);

router.get(
	"teams/:teamId/calendar/events",
	verifyToken,
	checkTeamAccess,
	calendars.getAllEvents
);

router.get(
	"teams/:teamId/calendar/events/:eventId",
	verifyToken,
	checkTeamAccess,
	calendars.getEventById
);

router.patch(
	"teams/:teamId/calendar/events/:eventId",
	verifyToken,
	checkTeamAccess,
	calendars.editEvent
);

router.delete(
	"teams/:teamId/calendar/events/:eventId",
	verifyToken,
	checkTeamAccess,
	calendars.deleteEvent
);

module.exports = router;
