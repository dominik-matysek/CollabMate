const express = require("express");
const router = express.Router();
const users = require("../controllers/user");
const { verifyToken } = require("../middlewares/auth");

router.post("/register", users.register);

router.post("/login", users.login);

router.get("/authenticate", verifyToken, users.authenticate);

router.post("/update/profile/:id", verifyToken, users.updateProfile);

module.exports = router;
