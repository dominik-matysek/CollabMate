const express = require("express");
const router = express.Router();
const calendars = require("../controllers/calendar");
const { verifyToken } = require("../middlewares/auth");

router.post(
	"/:teamId/calendar/create-event",
	verifyToken,
	calendars.createEvent
); //CZŁONEK ZESPOŁU

router.get("/:teamId/calendar/events", verifyToken, calendars.getAllEvents); //CZŁONEK ZESPOŁU

router.get(
	"/:teamId/calendar/events/:eventId",
	verifyToken,
	calendars.getEventById
); //CZŁONEK ZESPOŁU

router.patch(
	"/:teamId/calendar/events/:eventId",
	verifyToken,
	calendars.editEvent
); //CZŁONEK ZESPOŁU

router.delete(
	"/:teamId/calendar/events/:eventId",
	verifyToken,
	calendars.deleteEvent
); //CZŁONEK ZESPOŁU

module.exports = router;
