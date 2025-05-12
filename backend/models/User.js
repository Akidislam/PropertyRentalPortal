const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  birthDate: {
    type: Date,
    required: true,
  },

  nid: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    enum: ['tenant', 'landlord'],
    default: 'tenant',
  },

  profilePicture: {
    type: String,
    default: null
  },

  landlordemail: {
    type: String,
    default: null,
  },

  tenantemail: {
    type: String,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  walletcoin: {
    type: Number,
    default: 0,
  }
});

// Add index for faster queries
userSchema.index({ email: 1, role: 1 });

module.exports = mongoose.model('User', userSchema);


// // models/User.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },

//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },

//   password: {
//     type: String,
//     required: true,
//   },

//   birthDate: {
//     type: Date,
//     required: true,
//   },

//   nid: {
//     type: String,
//     required: true,
//   },

//   phoneNumber: {
//     type: String,
//     required: true,
//   },

//   role: {
//     type: String,
//     required: true,
//     enum: ['tenant', 'landlord'],
//     default: 'tenant',
//   },

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },

//   walletcoin: {
//     type: Number,
//     default: 0,
//   }
// });

// module.exports = mongoose.model('User', userSchema);

