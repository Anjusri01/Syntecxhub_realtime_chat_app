const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Import the security interceptor
const messageController = require('../controllers/messageController');

// ❌ PUBLIC ENDPOINTS: Anyone can ping this (Example)
// router.get('/public-announcements', messageController.getAnnouncements);

// ✅ SECURED ENDPOINTS: Moving down requires a valid token header payload
router.get('/:otherUserId', protect, messageController.getChatHistory);
router.post('/send', protect, messageController.saveNewMessage);

module.exports = router;
