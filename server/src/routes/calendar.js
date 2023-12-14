const express = require("express");
const router = express.Router();
const calendars = require("../controllers/calendar");
const verify = require("../middlewares/auth");

router.post("/:teamId/create-event", verify, calendars.createEvent);

router.get("/:teamId/events", verify, calendars.getAllEvents);

router.get("/:teamId/events/:id", verify, calendars.getEventById);

router.post("/:teamId/events/:id/edit", verify, calendars.editEvent);

router.delete("/:teamId/events/:id", verify, calendars.deleteEvent);

module.exports = router;
