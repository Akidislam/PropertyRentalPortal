const Support = require('../models/Support');
const nodemailer = require('nodemailer');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Submit support ticket
exports.submitSupport = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9+\-() ]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number'
      });
    }

    const support = await Support.create({
      name,
      email,
      phone,
      message
    });

    // Send confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Support Ticket Received - PropertyWave',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0c8cac;">Thank you for contacting PropertyWave Support</h2>
          <p>Dear ${name},</p>
          <p>We have received your support ticket and will get back to you shortly.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
          </div>
          <p>Best regards,<br>PropertyWave Support Team</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(userMailOptions);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully',
      data: support
    });
  } catch (error) {
    console.error('Error submitting support ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting support ticket',
      error: error.message
    });
  }
};

// Get all support tickets (admin)
exports.getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await Support.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching support tickets',
      error: error.message
    });
  }
};

// Update support ticket status and solution (admin)
exports.updateSupportTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { solution } = req.body;

    if (!solution || !solution.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Solution is required'
      });
    }

    const ticket = await Support.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    ticket.status = 'resolved';
    ticket.solution = solution;
    ticket.updatedAt = Date.now();
    await ticket.save();

    // Send solution email to user
    const solutionMailOptions = {
      from: process.env.EMAIL_USER,
      to: ticket.email,
      subject: 'Your Support Ticket Has Been Resolved - PropertyWave',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0c8cac;">Your Support Ticket Has Been Resolved</h2>
          <p>Dear ${ticket.name},</p>
          <p>We have reviewed your support ticket and provided a solution.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your Original Message:</strong></p>
            <p>${ticket.message}</p>
            <p><strong>Our Solution:</strong></p>
            <p>${solution}</p>
          </div>
          <p>If you have any further questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>PropertyWave Support Team</p>
        </div>
      `
    };

    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email configuration is missing');
      }
      await transporter.sendMail(solutionMailOptions);
    } catch (emailError) {
      console.error('Error sending solution email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send solution email. Please check email configuration.',
        error: emailError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Support ticket updated and solution email sent successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error updating support ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating support ticket',
      error: error.message
    });
  }
};

// Add a reply to a ticket and send email
exports.addReply = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }

    const ticket = await Support.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Add reply to ticket
    if (!ticket.replies) {
      ticket.replies = [];
    }
    ticket.replies.push({ 
      message: reply,
      createdAt: Date.now()
    });
    ticket.status = 'in-progress';
    await ticket.save();

    // Send email to the ticket creator
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: ticket.email,
        subject: `Re: Your Support Ticket #${ticket._id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0c8cac;">Support Ticket Update</h2>
            <p>Dear ${ticket.name},</p>
            <p>We have received your support ticket and would like to provide you with an update.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Your Original Message:</strong></p>
              <p>${ticket.message}</p>
              <p><strong>Our Response:</strong></p>
              <p>${reply}</p>
            </div>
            <p>If you have any further questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>PropertyWave Support Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error in addReply:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding reply',
      error: error.message
    });
  }
};

// Update ticket status
exports.updateStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!['pending', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const ticket = await Support.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Error in updateStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ticket status',
      error: error.message
    });
  }
}; 