const express = require('express');
const router = express.Router();
const rentalRequestController = require('../controllers/rentalRequestController');

// Create rental request
router.post('/create', rentalRequestController.createRentalRequest);

// Get rental requests by landlord email
router.get('/landlord/:landlordEmail', rentalRequestController.getRentalRequestsByLandlord);

// Get rental requests by tenant email
router.get('/tenant/:tenantEmail', rentalRequestController.getRentalRequestsByTenant);

// Approve rental request
router.put('/approve/:id', rentalRequestController.approveRentalRequest);

// Reject rental request
router.put('/reject/:id', rentalRequestController.rejectRentalRequest);

module.exports = router;
