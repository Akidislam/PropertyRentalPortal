const About = require('../models/About');

// Get about content
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne().sort({ createdAt: -1 });
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }
    res.status(200).json({
      success: true,
      data: about
    });
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching about content',
      error: error.message
    });
  }
};

// Create or update about content
exports.createOrUpdateAbout = async (req, res) => {
  try {
    const {
      title,
      subquote,
      mission,
      vision,
      features,
      forTenant,
      forLandlord,
      contact,
      socialLinks,
      stats
    } = req.body;

    // Validate required fields
    if (!title || !subquote || !mission || !vision || !features || !forTenant || !forLandlord || !contact) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Find existing about content
    let about = await About.findOne().sort({ createdAt: -1 });

    if (about) {
      // Update existing content
      about.title = title;
      about.subquote = subquote;
      about.mission = mission;
      about.vision = vision;
      about.features = features;
      about.forTenant = forTenant;
      about.forLandlord = forLandlord;
      about.contact = contact;
      about.socialLinks = socialLinks || about.socialLinks;
      about.stats = stats || about.stats;
      await about.save();
    } else {
      // Create new content
      about = await About.create({
        title,
        subquote,
        mission,
        vision,
        features,
        forTenant,
        forLandlord,
        contact,
        socialLinks,
        stats
      });
    }

    res.status(200).json({
      success: true,
      message: about._id ? 'About content updated successfully' : 'About content created successfully',
      data: about
    });
  } catch (error) {
    console.error('Error creating/updating about content:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating/updating about content',
      error: error.message
    });
  }
};

// Delete about content
exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findOne().sort({ createdAt: -1 });
    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }

    await about.deleteOne();
    res.status(200).json({
      success: true,
      message: 'About content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting about content:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting about content',
      error: error.message
    });
  }
}; 