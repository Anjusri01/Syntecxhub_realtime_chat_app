const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary'); // 1. Import your upload helper

// 2. Attach the inline upload handler intercepting file arrays ('avatar' matches the frontend form field name)
router.put(
  '/profile/avatar', 
  protect, 
  upload.single('avatar'), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file document detected.' });
      }

      // Cloudinary automatically returns a publicly accessible web address path under path 'path' or 'url'
      const secureImageUrl = req.file.path; 

      return res.status(200).json({
        success: true,
        message: 'Asset pushed to Cloudinary servers successfully.',
        imageUrl: secureImageUrl
      });
    } catch (error) {
      console.error('❌ Cloudinary route crash:', error);
      return res.status(500).json({ success: false, message: 'Internal cloud storage upload failure.' });
    }
  }
);

module.exports = router;
