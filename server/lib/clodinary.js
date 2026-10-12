const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Initialize and authorize the Cloudinary instance mapping environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure the Multer storage framework specifically for automated Cloudinary asset uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pulse_chat_media', // The directory path target inside your Cloudinary dashboard web panel
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Enforces strict file type validation boundaries
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Automated resizing helper to prevent layout breakages
  }
});

// 3. Initialize the standard Multer upload middleware engine
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Strict safety cap parameter sets max size to 5MB
});

module.exports = {
  cloudinary,
  upload
};
