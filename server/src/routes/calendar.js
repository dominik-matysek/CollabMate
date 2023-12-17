const express = require("express");
const router = express.Router();
const calendars = require("../controllers/calendar");
const { verifyToken } = require("../middlewares/auth");

router.post("/:teamId/create-event", verifyToken, calendars.createEvent);

router.get("/:teamId/events", verifyToken, calendars.getAllEvents);

router.get("/:teamId/events/:id", verifyToken, calendars.getEventById);

router.post("/:teamId/events/:id/edit", verifyToken, calendars.editEvent);

router.delete("/:teamId/events/:id", verifyToken, calendars.deleteEvent);

module.exports = router;
