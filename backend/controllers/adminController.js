const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Property = require('../models/Property');
const RentalRequest = require('../models/RentalRequest');
const PaymentHistory = require('../models/PaymentHistory');
const nodemailer = require('nodemailer');

// Get all rental requests (active rentals)
exports.getAllRentalRequests = async (req, res) => {
  try {
    const rentals = await RentalRequest.find()
      .populate('propertyId', 'title location price advance images')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      data: rentals
    });
  } catch (error) {
    console.error('Error fetching admin rentals:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({
      token,
      user: { username: 'admin', role: 'admin' }
    });
  } else {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ role: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, birthDate, nid, phoneNumber, role } = req.body;
    const newUser = new User({ name, email, password, birthDate, nid, phoneNumber, role });
    await newUser.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error });
  }
};

// Update an existing user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, birthDate, nid, phoneNumber, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, password, birthDate, nid, phoneNumber, role });
    res.status(200).json({ msg: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error });
  }
};

// Get User History (Full record for profile)
exports.getUserHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let history = {
      user,
      properties: [],
      rentalRequests: [],
      payments: []
    };

    if (user.role === 'landlord') {
      history.properties = await Property.find({ uploaderEmail: user.email.toLowerCase() });
      history.rentalRequests = await RentalRequest.find({ landlordEmail: user.email.toLowerCase() })
        .populate('propertyId', 'title location images');
      history.payments = await PaymentHistory.find({ landlordId: user._id })
        .populate('propertyId', 'title')
        .populate('tenantId', 'name email');
    } else {
      history.rentalRequests = await RentalRequest.find({ tenantEmail: user.email.toLowerCase() })
        .populate('propertyId', 'title location images');
      history.payments = await PaymentHistory.find({ tenantId: user._id })
        .populate('propertyId', 'title')
        .populate('landlordId', 'name email');
    }

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all properties for approval
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST approve/decline property by admin
exports.approveOrDeclineProperty = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be either approved or rejected' });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.status = status;
    await property.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: property.uploaderEmail,
      subject: `Property ${status} - ${property.title}`,
      html: `<h3>Hello ${property.uploaderName},</h3>
             <p>Your property listing has been <b>${status}</b> by the admin.</p>`
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    res.status(200).json({ 
      message: `Property ${status} successfully`,
      property
    });
  } catch (err) {
    console.error('Error updating property status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
