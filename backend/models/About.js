const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subquote: {
    type: String,
    required: [true, 'Subquote is required'],
    trim: true
  },
  mission: {
    type: String,
    required: [true, 'Mission is required'],
    trim: true
  },
  vision: {
    type: String,
    required: [true, 'Vision is required'],
    trim: true
  },
  features: [{
    type: String,
    required: [true, 'Features are required'],
    trim: true
  }],
  forTenant: {
    type: String,
    required: [true, 'Tenant information is required'],
    trim: true
  },
  forLandlord: {
    type: String,
    required: [true, 'Landlord information is required'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true
  },
  socialLinks: {
    facebook: { type: String, trim: true, default: '' },
    twitter: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema); 