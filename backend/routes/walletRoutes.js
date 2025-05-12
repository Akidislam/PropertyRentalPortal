const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Get wallet details
router.get('/:userId', walletController.getWallet);

// Add coins to wallet
router.post('/add/:userId', walletController.addCoins);

// Deduct coins from wallet
router.post('/deduct/:userId', walletController.deductCoins);

// Request advance payment
router.post('/request-advance/:rentalRequestId', walletController.requestAdvance);

// Pay advance
router.post('/pay-advance/:paymentId', walletController.payAdvance);

// Get payment history
router.get('/history/:userId', walletController.getPaymentHistory);

// Get pending payments
router.get('/pending/:rentalRequestId', walletController.getPendingPayments);

module.exports = router;
