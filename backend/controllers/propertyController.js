const Property = require('../models/Property');
const path = require('path');
const fs = require('fs');

exports.addProperty = async (req, res) => {
  try {
    const imagePaths = req.files.map(file => '/uploads/' + file.filename);

    const {
      title,
      description,
      type,
      address,
      location,
      area,
      rooms,
      bathrooms,
      price,
      advance,
      phone,
      rentType,
      uploaderName,
      uploaderEmail
    } = req.body;

    // Validate required fields
    if (!uploaderEmail) {
      return res.status(400).json({ msg: 'Uploader email is required' });
    }

    const newProperty = new Property({
      title,
      description,
      type,
      address,
      location,
      area,
      rooms,
      bathrooms,
      price,
      advance,
      phone,
      rentType,
      uploaderName,
      uploaderEmail: uploaderEmail.toLowerCase(), // Normalize email to lowercase
      images: imagePaths,
      status: 'pending',
      isRented: false
    });

    await newProperty.save();
    res.status(201).json({ 
      msg: 'Property added successfully',
      property: newProperty
    });
  } catch (err) {
    console.error('Error adding property:', err);
    res.status(500).json({ msg: 'Error adding property' });
  }
};

// Get All Properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching properties' });
  }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: 'Property not found' });

    // Delete images from the uploads folder
    property.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, '..', imagePath);
      fs.unlinkSync(fullPath); // Sync delete for simplicity
    });

    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting property' });
  }
};
exports.getApprovedProperties = async (req, res) => {
  try {
    const approvedProperties = await Property.find({ status: 'approved' });
    res.status(200).json(approvedProperties);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching approved properties' });
  }
};

