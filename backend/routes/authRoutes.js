const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth'); // Updated to destructure auth
const upload = require('../middleware/upload');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.get('/user-info', auth, authController.getUserInfo);

// Profile routes
router.get('/profile', auth, async (req, res) => {
  try {
    // Get user from the database using the ID from the token
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profilePicture: user.profilePicture,
      walletcoin: user.walletcoin
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, phoneNumber, password } = req.body;
    
    // Find user by ID from token
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Handle profile picture upload
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    // Save the updated user
    await user.save();

    // Get the updated user data without password
    const updatedUser = await User.findById(req.user._id).select('-password');
    
    // Return the updated user data
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      walletcoin: updatedUser.walletcoin
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token and get user role
router.get('/verify', auth, (req, res) => {
  res.json({
    success: true,
    role: req.user.role
  });
});

// Get user data
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
