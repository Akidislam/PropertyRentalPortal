const mongoose = require('mongoose');

const rentalRequestSchema = new mongoose.Schema({
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
  },
  propertyTitle: {
    type: String,
    required: true
  },
  propertyLocation: {
    type: String,
    required: true
  },
  propertyPrice: {
    type: Number,
    required: true
  },
  propertyRentType: {
    type: String,
    required: true
  },
  propertyArea: {
    type: Number,
    required: true
  },
  propertyRooms: {
    type: Number,
    required: true
  },
  propertyBathrooms: {
    type: Number,
    required: true
  },
  propertyType: {
    type: String,
    required: true
  },
  propertyAdvance: {
    type: Number,
    required: true
  },
  propertyDescription: {
    type: String
  },
  propertyAddress: {
    type: String,
    required: true
  },
  propertyPhone: {
    type: String,
    required: true
  },
  propertyImages: [{
    type: String
  }],
  landlordEmail: { 
    type: String, 
    required: true, 
    lowercase: true 
  },
  landlordName: {
    type: String,
    required: true
  },
  tenantName: { 
    type: String, 
    required: true,
    trim: true
  },
  tenantEmail: { 
    type: String, 
    required: true, 
    lowercase: true,
    trim: true
  },
  tenantPhone: { 
    type: String, 
    required: true,
    trim: true
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  hasAdvanceRequest: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for faster queries
rentalRequestSchema.index({ landlordEmail: 1, status: 1 });
rentalRequestSchema.index({ tenantEmail: 1, status: 1 });
rentalRequestSchema.index({ propertyId: 1, status: 1 });

// Virtual for formatted date
rentalRequestSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

module.exports = mongoose.model('RentalRequest', rentalRequestSchema);
