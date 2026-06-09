// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/users', userRoutes);
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/wallet-history', require('./routes/walletHistoryRoutes'));
app.use('/api/rentalrequests', require('./routes/rentalRequestRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
