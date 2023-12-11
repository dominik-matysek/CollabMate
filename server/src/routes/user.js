const express = require("express");
const router = express.Router();
const users = require("../controllers/user");
const verify = require("../middlewares/auth");

router.post("/register", users.register);

router.post("/login", users.login);

router.get("/authenticate", verify, users.authenticate);

router.post("/update/profile/:id", verify, users.updateProile);

module.exports = router;
