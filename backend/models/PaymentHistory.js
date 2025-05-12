const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema({
  rentalRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RentalRequest',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['advance', 'rent'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add indexes for faster queries
paymentHistorySchema.index({ tenantId: 1, createdAt: -1 });
paymentHistorySchema.index({ landlordId: 1, createdAt: -1 });
paymentHistorySchema.index({ rentalRequestId: 1 });

module.exports = mongoose.model('PaymentHistory', paymentHistorySchema); 