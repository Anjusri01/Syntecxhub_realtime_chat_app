const User = require('../models/User'); // Adjust path based on your exact folder layout
const jwt = require('jsonwebtoken');

/**
 * GENERATE JSON WEB TOKEN HELPER METHOD
 * Signs a secure access token bound to the document configuration object parameters.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'pulse_secret_key_matrix_123', {
    expiresIn: '30d', // Session life lasts for 30 calendar days
  });
};

/**
 * 1. REGISTER NEW USER PROFILE / INITIAL LOGIN FLOW
 * Creates an entry inside MongoDB or authenticates the current profile if it already exists.
 * Route: POST /api/users/login
 */
exports.authUserSession = async (req, res) => {
  try {
    const { username, avatar } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input profile parameters. Username field is required.'
      });
    }

    const cleanUsername = username.trim();

    // Look for an existing account document matching the nickname string
    let user = await User.findOne({ username: cleanUsername });

    // Fallback: If no account document profile exists, construct a new one dynamically
    if (!user) {
      // Choose a fallback avatar template thumbnail if nothing was provided
      const defaultAvatar = avatar || `https://unsplash.com`;
      
      user = new User({
        username: cleanUsername,
        avatar: defaultAvatar,
        status: 'Hey there! I am using Pulse.',
        isOnline: true
      });
      await user.save();
    } else {
      // If user exists, flip their status parameters back to online
      user.isOnline = true;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        status: user.status,
        isOnline: user.isOnline,
        token: generateToken(user._id) // Dispatches security signature token
      }
    });

  } catch (error) {
    console.error('❌ Error caught inside authUserSession userController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error. Login profile creation failed.'
    });
  }
};

/**
 * 2. GET ALL REGISTERED USERS DIRECTORY
 * Fetches the global contacts tree to populate the active sidebar inbox listing views.
 * Route: GET /api/users
 */
exports.getAllContactsList = async (req, res) => {
  try {
    // Fetch all profiles from the collection, excluding the current requesting user
    const currentUserId = req.user ? req.user.id : null;
    
    const queryConditions = currentUserId ? { _id: { \$ne: currentUserId } } : {};
    const contacts = await User.find(queryConditions)
      .select('-__v') // Strips internal Mongoose validation version values
      .sort({ username: 1 }); // Alpha layout sorting order rules

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });

  } catch (error) {
    console.error('❌ Error caught inside getAllContactsList userController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error. Failed to fetch system contacts.'
    });
  }
};

/**
 * 3. UPDATE ACTIVE USER PROFILE / STATUS FIELDS
 * Modifies about fields or changes display nicknames within global states.
 * Route: PUT /api/users/profile
 */
exports.updateUserProfileData = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Extracted via security middleware tokens
    const { username, status, avatar } = req.body;

    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account profile not found within current registry.'
      });
    }

    // Apply updates if parameters are provided
    if (username && username.trim()) user.username = username.trim();
    if (status !== undefined) user.status = status.trim();
    if (avatar) user.avatar = avatar;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile records written successfully.',
      data: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        status: user.status
      }
    });

  } catch (error) {
    console.error('❌ Error caught inside updateUserProfileData userController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error. Profile synchronization failed.'
    });
  }
};
