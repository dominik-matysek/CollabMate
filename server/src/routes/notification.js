const express = require("express");
const router = express.Router();
const notifications = require("../controllers/notification");
const { verifyToken } = require("../middlewares/auth");

router.post("/create", verifyToken, notifications.createNotification);

router.get("/", verifyToken, notifications.getNotifications);

router.patch("/:id/mark-as-read", verifyToken, notifications.readNotifications);

router.delete("/:id", verifyToken, notifications.deleteNotification);

router.delete("/", verifyToken, notifications.deleteAllNotifications);

module.exports = router;
