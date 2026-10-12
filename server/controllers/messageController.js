const Message = require('../models/Message'); // Adjust the path based on your exact file mapping

/**
 * 1. GET HISTORICAL DIRECT MESSAGES BETWEEN TWO USERS
 * Fetches the chronological conversation logs between the authenticated user and a target contact.
 * Route: GET /api/messages/:otherUserId
 */
exports.getChatHistory = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.id; // Injected via your JWT auth middleware rule layer

    // Query messages where sender is current user AND receiver is target user, OR vice versa
    const chatLogs = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
    .sort({ createdAt: 1 }); // 1 dictates ascending chronological format (oldest to newest)

    return res.status(200).json({
      success: true,
      count: chatLogs.length,
      data: chatLogs
    });

  } catch (error) {
    console.error('❌ Error caught inside getChatHistory controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error. Failed to fetch historical message logs.'
    });
  }
};

/**
 * 2. PERSIST NEW DIRECT MESSAGE LOG ENTRY
 * Commits a brand-new message payload directly to the MongoDB collections.
 * Route: POST /api/messages/send
 */
exports.saveNewMessage = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Sender identity extracted securely from request contexts
    const { receiverId, text } = req.body;

    // Reject processing attempts containing blank parameters
    if (!receiverId || !text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request constraints. Missing target receiverId or message text.'
      });
    }

    // Instantiates the record model matching schema structures
    const messageRecord = new Message({
      sender: currentUserId,
      receiver: receiverId,
      text: text.trim()
    });

    // Commit changes asynchronously to the cluster database
    await messageRecord.save();

    // Populate schema relational fields before shipping response objects back out
    const populatedMessage = await messageRecord.populate([
      { path: 'sender', select: 'username avatar' },
      { path: 'receiver', select: 'username avatar' }
    ]);

    return res.status(201).json({
      success: true,
      data: populatedMessage
    });

  } catch (error) {
    console.error('❌ Error caught inside saveNewMessage controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error. Failed to securely broadcast and save the target message.'
    });
  }
};

/**
 * 3. MARK DIRECT MESSAGES AS READ
 * Batch updates unread messages from a contact to clear notification counters.
 * Route: PUT /api/messages/read/:senderId
 */
exports.markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const currentUserId = req.user.id; // The recipient user clearing their inbox panel

    await Message.updateMany(
      { sender: senderId, receiver: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: 'Conversation stream update compiled. Notification counters cleared successfully.'
    });

  } catch (error) {
    console.error('❌ Error caught inside markAsRead controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error. Failed to mark conversation items as read.'
    });
  }
};
