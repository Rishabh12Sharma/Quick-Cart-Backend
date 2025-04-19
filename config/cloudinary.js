const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// 🔹 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Multer Storage Setup for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

// 🔹 Initialize Multer with Cloudinary Storage
const upload = multer({ storage });

module.exports = { cloudinary, upload };
