const express = require('express');
const router = express.Router();
const walletHistoryController = require('../controllers/walletHistoryController');

// Get wallet history for a user
router.get('/:userId/:userType', walletHistoryController.getWalletHistory);

// Add new wallet transaction
router.post('/', walletHistoryController.addWalletTransaction);

// Update transaction status
router.put('/:transactionId', walletHistoryController.updateTransactionStatus);

module.exports = router; 