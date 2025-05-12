const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  address: String,
  location: String, // New
  area: Number,
  rooms: Number,
  bathrooms: Number,
  price: Number, // Taka
  advance: Number, // Taka
  phone: String, // New
  rentType: String,
  images: [String],
  uploaderName: String,
  uploaderEmail: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isRented: {
    type: Boolean,
    default: false,
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
