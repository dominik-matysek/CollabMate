const express = require("express");
const router = express.Router();
const logs = require("../controllers/log");
const { verifyToken, verifyAdmin } = require("../middlewares/auth");

router.get("/logs", verifyToken, verifyAdmin, logs.getAllLogs);

module.exports = router;