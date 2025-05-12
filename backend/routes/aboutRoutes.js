const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const aboutController = require('../controllers/aboutController');

// Public route for viewing about content
router.get('/', aboutController.getAbout);

// Protected admin routes
router.post('/', adminAuth, aboutController.createOrUpdateAbout);
router.delete('/', adminAuth, aboutController.deleteAbout);

module.exports = router; 