const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ✅ Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Folder name in Cloudinary
    format: async (req, file) => "png", // Convert all images to PNG
    public_id: (req, file) => file.originalname.split(".")[0], // Use original filename
  },
});

const upload = multer({ storage });

module.exports = upload;
