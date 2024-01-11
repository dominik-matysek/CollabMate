const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
	cloud_name: process.env.cloudinary_cloud_name,
	api_key: process.env.cloudinary_api_key,
	api_secret: process.env.cloudinary_api_secret,
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "CollabMate",
		allowedFormats: ["jpeg", "png", "jpg"],
		transformation: [
			{ width: 256, height: 256, crop: "fill", gravity: "auto" },
		],
	},
});

module.exports = {
	cloudinary,
	storage,
};
