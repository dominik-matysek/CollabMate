const express = require("express");
const router = express.Router();
const users = require("../controllers/user");
const { verifyToken, verifyAdmin } = require("../middlewares/auth");
const { cloudinary, storage } = require("../config/cloudinary");
const multer = require("multer");

const upload = multer({ storage: storage });

router.post("/register", users.register);

router.post("/login", users.login);

router.post("/logout", users.logout);

router.get("/authenticate", verifyToken, users.authenticate);

router.post("/profile/:id", verifyToken, users.updateProfile);

router.post("/upload-image", upload.single("file"), users.uploadImage);

router.get("/", verifyToken, verifyAdmin, users.getAllUsers);

module.exports = router;
