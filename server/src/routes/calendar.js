const express = require("express");
const router = express.Router();
const calendars = require("../controllers/calendar");
const verify = require("../middlewares/auth");

router.post("/create-event", verify, calendars.createEvent);

router.get("/events", verify, calendars.getAllEvents);

router.get("/events/:id", verify, calendars.getEventById);

router.post("/events/:id/edit", verify, calendars.editEvent);

router.delete("/events/:id", verify, calendars.deleteEvent);

module.exports = router;
