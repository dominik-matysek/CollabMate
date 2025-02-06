const express = require("express");
const router = express.Router();
const users = require("../controllers/user");
const { verifyToken, verifyAdmin } = require("../middlewares/auth");
const { profileStorage } = require("../config/cloudinary");
const multer = require("multer");

const upload = multer({
	storage: profileStorage,
	limits: { fileSize: 1024 * 1024 * 5 },
});

router.post("/register", users.register);

router.post("/login", users.login);

router.post("/logout", users.logout);

router.get("/authenticate", verifyToken, users.authenticate);

router.patch("/:userId", users.setInitialProfilePic);

router.patch("/profile/:userId", verifyToken, users.updateProfile);

router.post("/upload-image", upload.single("file"), users.uploadImage);

router.get("/", verifyToken, users.getAllUsers);

router.get("/profile/:userId", verifyToken, users.getUserInfo);

router.delete("/:userId", verifyToken, verifyAdmin, users.removeUserFromSystem);

router.post("/refresh-token", users.refreshToken);

//google oauth
router.get("/auth/google", users.googleLogin);
router.get("/auth/google/callback", users.googleCallback);


module.exports = router;
