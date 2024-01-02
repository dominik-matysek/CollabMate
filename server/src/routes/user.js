const express = require("express");
const router = express.Router();
const users = require("../controllers/user");
const { verifyToken } = require("../middlewares/auth");
const { cloudinary, storage } = require("../config/cloudinary");
const multer = require("multer");

const upload = multer({ storage: storage });

router.post("/register", users.register);

router.post("/login", users.login);

router.get("/authenticate", verifyToken, users.authenticate);

router.post("/profile/:id/update", verifyToken, users.updateProfile);

router.post("/upload-image", upload.single("file"), users.uploadImage);

module.exports = router;
