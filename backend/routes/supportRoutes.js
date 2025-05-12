const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

// Public routes
router.post('/submit', supportController.submitSupport);
router.get('/tickets', supportController.getAllSupportTickets);
router.put('/tickets/:id', supportController.updateSupportTicket);
router.put('/status/:ticketId', supportController.updateStatus);
router.post('/solution/:id', supportController.addReply);

module.exports = router; 