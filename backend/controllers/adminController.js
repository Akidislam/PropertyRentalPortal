const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Property = require('../models/Property');  // Assuming your Property schema is in models/Property.js
 // Assuming User schema is in models/User.js
const nodemailer = require('nodemailer');



// Admin Login

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


// GET all properties for approval
exports.getAllProperties = async (req, res) => {
  try {
    // Get all properties with pending status by default
    const properties = await Property.find({ status: 'pending' })
      .sort({ createdAt: -1 });
    
    if (!properties || properties.length === 0) {
      return res.status(200).json({ 
        properties: [],
        message: 'No pending properties found'
      });
    }

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
    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be either approved or rejected' });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Update property status
    property.status = status;
    await property.save();

    // Email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'wavedev13@gmail.com',
        pass: process.env.EMAIL_PASS || 'dnrf axht vtvv bweg'
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'wavedev13@gmail.com',
      to: property.uploaderEmail,
      subject: `Property ${status} - ${property.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">Property ${status}</h2>
          <p>Hello ${property.uploaderName},</p>
          <p>Your property listing has been ${status.toLowerCase()} by the admin.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Property Details:</h3>
            <p><strong>Title:</strong> ${property.title}</p>
            <p><strong>Type:</strong> ${property.type}</p>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Price:</strong> ৳${property.price}</p>
          </div>
          ${status === 'approved' ? `
            <p>Your property is now visible to potential renters.</p>
          ` : `
            <p>If you have any questions about this decision, please contact our support team.</p>
          `}
          <p>Thanks,<br/>PropertyWave Team</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email fails
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