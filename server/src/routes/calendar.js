const express = require("express");
const router = express.Router();
const calendars = require("../controllers/calendar");
const { verifyToken } = require("../middlewares/auth");

router.post(
	"/:teamId/calendar/create-event",
	verifyToken,
	calendars.createEvent
);

router.get("/:teamId/calendar/events", verifyToken, calendars.getAllEvents);

router.get(
	"/:teamId/calendar/events/:eventId",
	verifyToken,
	calendars.getEventById
);

router.patch(
	"/:teamId/calendar/events/:eventId",
	verifyToken,
	calendars.editEvent
);

router.delete(
	"/:teamId/calendar/events/:eventId",
	verifyToken,
	calendars.deleteEvent
);

module.exports = router;
