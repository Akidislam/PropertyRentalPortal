const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  addProperty,
  getAllProperties,
  deleteProperty,
  getApprovedProperties
} = require('../controllers/propertyController');

router.post('/add', upload.array('images', 5), addProperty);
router.get('/all', getAllProperties);
router.get('/approved', getApprovedProperties); // ✅ New Route
router.delete('/delete/:id', deleteProperty);

module.exports = router;
