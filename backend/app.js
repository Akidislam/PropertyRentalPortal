const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/wallet-history', require('./routes/walletHistoryRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/rentalrequests', require('./routes/rentalRequestRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 