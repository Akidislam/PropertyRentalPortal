const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// ... existing routes ...

module.exports = router; 