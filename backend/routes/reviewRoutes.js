const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Public routes
router.post('/submit', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const { sortBy = 'date' } = req.query;
    let sortOption = { createdAt: -1 }; // Default sort by date

    if (sortBy === 'rating') {
      sortOption = { rating: -1 };
    } else if (sortBy === 'name') {
      sortOption = { name: 1 };
    }

    const reviews = await Review.find().sort(sortOption);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// Admin routes (without authentication)
router.get('/admin/all', async (req, res) => {
  try {
    const { sortBy = 'date', search = '' } = req.query;
    let sortOption = { createdAt: -1 };

    if (sortBy === 'rating') {
      sortOption = { rating: -1 };
    } else if (sortBy === 'name') {
      sortOption = { name: 1 };
    }

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { propertyTitle: { $regex: search, $options: 'i' } },
          { propertyAddress: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const reviews = await Review.find(query).sort(sortOption);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

router.delete('/admin/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

module.exports = router; 