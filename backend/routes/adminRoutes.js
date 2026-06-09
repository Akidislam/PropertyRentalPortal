const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

// Admin login (public route)
router.post('/login', adminController.adminLogin);

// Protected routes - require admin authentication
router.use(adminAuth);

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id/history', adminController.getUserHistory);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Property approval routes
router.get('/properties', adminController.getAllProperties);
router.post('/approve/:id', adminController.approveOrDeclineProperty);

// Admin rental tracking
router.get('/rentals', adminController.getAllRentalRequests);

module.exports = router;
