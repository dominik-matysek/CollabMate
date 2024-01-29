const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CollabMate/ProfilePictures",
    allowedFormats: ["jpeg", "png", "jpg"],
    transformation: [
      { width: 256, height: 256, crop: "fill", gravity: "auto" },
    ],
  },
});

const attachementStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CollabMate/Attachments",
    allowedFormats: ["jpeg", "png", "jpg", "pdf"],
    public_id: (req, file) => {
      // Extract the filename without the extension
      const fileNameWithoutExtension = file.originalname
        .split(".")
        .slice(0, -1)
        .join(".");
      return fileNameWithoutExtension;
    },
  },
});

const deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error(
      "Wystąpił błąd przy próbie usunięcia pliku z Cloudinary:",
      error
    );
    return { success: false, error };
  }
};

module.exports = {
  cloudinary,
  profileStorage,
  attachementStorage,
  deleteFile,
};
