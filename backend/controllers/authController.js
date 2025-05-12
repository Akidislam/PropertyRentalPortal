const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

let otpStore = {}; // In-memory OTP store (email => { otp, userData, expiresAt })

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Step 1: Send OTP
exports.register = async (req, res) => {
  const { name, email, password, birthDate, nid, phoneNumber, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      userData: { name, email, password, birthDate, nid, phoneNumber, role }
    };

    await transporter.sendMail({
      from: `"PropertyWave" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your PropertyWave OTP Code',
      html: `<h3>Hello ${name},</h3>
             <p>Your OTP is: <b>${otp}</b></p>
             <p>It is valid for 10 minutes.</p>`
    });

    res.status(200).json({ msg: 'OTP sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error sending OTP' });
  }
};

// Step 2: Verify OTP and Save User
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];
  if (!record) return res.status(400).json({ msg: 'No OTP sent for this email' });

  if (record.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ msg: 'OTP expired. Please register again.' });
  }

  try {
    const { name, password, birthDate, nid, phoneNumber, role } = record.userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      birthDate,
      nid,
      phoneNumber,
      role,
      landlordemail: role === 'landlord' ? email : null,
      tenantemail: role === 'tenant' ? email : null,
      createdAt: Date.now()
    });

    await newUser.save();
    delete otpStore[email];

    res.status(201).json({ msg: '🎉 Successfully Registered!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error verifying and saving user' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user exists with the specified email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials or incorrect role selected' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      _id: user._id,
      role: user.role
    };

    // Sign token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profilePicture: user.profilePicture,
        walletcoin: user.walletcoin
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user info
// @route   GET /api/auth/user-info
// @access  Private
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get user info error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateWalletCoin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const { amount } = req.body;

    user.walletcoin += Number(amount);
    await user.save();

    res.json({ msg: 'Wallet updated', walletcoin: user.walletcoin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update wallet' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phoneNumber, password } = req.body;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    // Save updated user
    await user.save();

    // Return updated user info (excluding password)
    const updatedUser = await User.findById(userId).select('-password');
    res.json({
      success: true,
      user: updatedUser
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ msg: 'Error updating profile' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ msg: 'Error fetching profile' });
  }
};
