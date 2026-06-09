const mongoose = require('mongoose');

const walletHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['tenant', 'landlord'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionType: {
    type: String,
    enum: ['topup', 'payment', 'refund'],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['bkash', 'nagad', 'rocket', 'card'],
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Add indexes for faster queries
walletHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('WalletHistory', walletHistorySchema); 