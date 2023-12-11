const express = require("express");
const router = express.Router();
const notifications = require("../controllers/notification");
const verify = require("../middlewares/auth");

router.post("/create", verify, notifications.createNotification);

router.get("/", verify, notifications.getNotifications);

router.post("/:id/mark-as-read", verify, notifications.readNotifications);

router.delete("/:id", verify, notifications.deleteNotification);

router.delete("/delete-all", verify, notifications.deleteAllNotifications);

module.exports = router;
