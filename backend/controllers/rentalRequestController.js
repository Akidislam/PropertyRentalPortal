const RentalRequest = require('../models/RentalRequest');
const Property = require('../models/Property');
const User = require('../models/User');
const PaymentHistory = require('../models/PaymentHistory');

// Create new rental request (tenant)
exports.createRentalRequest = async (req, res) => {
  try {
    const { 
      propertyId,
      propertyTitle,
      propertyLocation,
      propertyPrice,
      propertyRentType,
      propertyArea,
      propertyRooms,
      propertyBathrooms,
      propertyType,
      propertyAdvance,
      propertyDescription,
      propertyAddress,
      propertyPhone,
      propertyImages,
      landlordEmail,
      landlordName,
      tenantName,
      tenantEmail,
      tenantPhone
    } = req.body;

    // Validate tenant email exists in database
    if (!tenantEmail) {
      return res.status(400).json({ message: 'Tenant email is required' });
    }

    const tenant = await User.findOne({ email: tenantEmail.toLowerCase() });
    if (!tenant) {
      return res.status(400).json({ message: 'Tenant email not found in our system' });
    }

    // Find the property to verify it exists and get additional details
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if property is already rented
    if (property.isRented) {
      return res.status(400).json({ message: 'This property is already rented' });
    }

    // Check if a pending request already exists for this property and tenant
    const existingRequest = await RentalRequest.findOne({
      propertyId,
      tenantEmail: tenantEmail.toLowerCase(),
      status: 'Pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this property' });
    }

    const newRequest = new RentalRequest({
      propertyId,
      propertyTitle,
      propertyLocation,
      propertyPrice,
      propertyRentType,
      propertyArea,
      propertyRooms,
      propertyBathrooms,
      propertyType,
      propertyAdvance,
      propertyDescription,
      propertyAddress,
      propertyPhone,
      propertyImages,
      landlordEmail: landlordEmail.toLowerCase(),
      landlordName,
      tenantName,
      tenantEmail: tenantEmail.toLowerCase(),
      tenantPhone,
      status: 'Pending'
    });

    await newRequest.save();
    res.status(201).json({ 
      message: 'Rental request sent successfully', 
      request: newRequest 
    });
  } catch (error) {
    console.error('Error creating rental request:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get rental requests for a landlord
exports.getRentalRequestsByLandlord = async (req, res) => {
  try {
    const { landlordEmail } = req.params;
    console.log('Received request for landlord email:', landlordEmail);

    if (!landlordEmail) {
      return res.status(400).json({ message: 'Landlord email is required' });
    }

    const normalizedEmail = landlordEmail.toLowerCase();
    console.log('Normalized email:', normalizedEmail);

    // Find rental requests where the landlordEmail matches and populate property data
    const requests = await RentalRequest.find({ 
      landlordEmail: normalizedEmail 
    })
    .populate('propertyId', 'title location price type area rooms bathrooms advance images phone address description')
    .sort({ createdAt: -1 }); // Sort by newest first

    if (!requests || requests.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    // Format the response
    const formattedRequests = requests.map(request => ({
      ...request.toObject(),
      status: request.status || 'Pending',
      createdAt: request.createdAt || new Date(),
      propertyId: {
        ...request.propertyId?.toObject(),
        title: request.propertyId?.title || request.propertyTitle,
        location: request.propertyId?.location || request.propertyLocation,
        price: request.propertyId?.price || request.propertyPrice,
        type: request.propertyId?.type || request.propertyType,
        area: request.propertyId?.area || request.propertyArea,
        rooms: request.propertyId?.rooms || request.propertyRooms,
        bathrooms: request.propertyId?.bathrooms || request.propertyBathrooms,
        advance: request.propertyId?.advance || request.propertyAdvance,
        images: request.propertyId?.images || request.propertyImages || [],
        phone: request.propertyId?.phone || request.propertyPhone,
        address: request.propertyId?.address || request.propertyAddress,
        description: request.propertyId?.description || request.propertyDescription
      }
    }));

    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error('Error in getRentalRequestsByLandlord:', error);
    res.status(500).json({ 
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get rental requests for a tenant
exports.getRentalRequestsByTenant = async (req, res) => {
  try {
    const { tenantEmail } = req.params;
    console.log('Received request for tenant email:', tenantEmail);

    if (!tenantEmail) {
      return res.status(400).json({ message: 'Tenant email is required' });
    }

    const normalizedEmail = tenantEmail.toLowerCase();
    console.log('Normalized email:', normalizedEmail);

    // Find rental requests where the tenantEmail matches and populate property data
    const requests = await RentalRequest.find({ 
      tenantEmail: normalizedEmail 
    })
    .populate({
      path: 'propertyId',
      select: 'title location price type area rooms bathrooms advance images phone address description rentType uploaderEmail uploaderName'
    })
    .sort({ createdAt: -1 }); // Sort by newest first

    if (!requests || requests.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    // Format the response
    const formattedRequests = requests.map(request => ({
      ...request.toObject(),
      status: request.status || 'Pending',
      createdAt: request.createdAt || new Date(),
      propertyId: {
        ...request.propertyId?.toObject(),
        title: request.propertyId?.title || request.propertyTitle,
        location: request.propertyId?.location || request.propertyLocation,
        price: request.propertyId?.price || request.propertyPrice,
        type: request.propertyId?.type || request.propertyType,
        area: request.propertyId?.area || request.propertyArea,
        rooms: request.propertyId?.rooms || request.propertyRooms,
        bathrooms: request.propertyId?.bathrooms || request.propertyBathrooms,
        advance: request.propertyId?.advance || request.propertyAdvance,
        images: request.propertyId?.images || request.propertyImages || [],
        phone: request.propertyId?.phone || request.propertyPhone,
        address: request.propertyId?.address || request.propertyAddress,
        description: request.propertyId?.description || request.propertyDescription,
        rentType: request.propertyId?.rentType || request.propertyRentType
      },
      landlordName: request.propertyId?.uploaderName || request.landlordName,
      landlordEmail: request.propertyId?.uploaderEmail || request.landlordEmail
    }));

    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error('Error in getRentalRequestsByTenant:', error);
    res.status(500).json({ 
      message: 'Server Error',
      error: error.message
    });
  }
};

// Approve rental request
exports.approveRentalRequest = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Approving request with ID:', id);

    const request = await RentalRequest.findById(id).populate('propertyId');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if property is already rented
    if (request.propertyId.isRented) {
      return res.status(400).json({ message: 'This property is already rented' });
    }

    // Lookup users to get their IDs for payment history
    const tenant = await User.findOne({ email: request.tenantEmail.toLowerCase() });
    const landlord = await User.findOne({ email: request.landlordEmail.toLowerCase() });

    if (!tenant || !landlord) {
      return res.status(404).json({ message: 'Tenant or landlord record not found in system' });
    }

    // Update request status
    request.status = 'Approved';
    request.hasAdvanceRequest = true; // Automatically trigger advance payment flow
    await request.save();

    // Update property status
    const property = await Property.findById(request.propertyId);
    if (property) {
      property.isRented = true;
      await property.save();
    }

    // Create automatic advance payment record
    const advancePayment = new PaymentHistory({
      rentalRequestId: request._id,
      propertyId: request.propertyId._id,
      tenantId: tenant._id,
      landlordId: landlord._id,
      amount: request.propertyAdvance || request.propertyId.advance || 0,
      type: 'advance',
      status: 'pending'
    });

    await advancePayment.save();

    res.status(200).json({ 
      message: 'Rental request approved and advance payment initiated successfully',
      request: request
    });
  } catch (error) {
    console.error('Error approving rental request:', error);
    res.status(500).json({ 
      message: 'Server Error',
      error: error.message 
    });
  }
};

// Reject rental request
exports.rejectRentalRequest = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Rejecting request with ID:', id);

    const request = await RentalRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'Rejected';
    await request.save();

    res.status(200).json({ 
      message: 'Rental request rejected successfully',
      request: request
    });
  } catch (error) {
    console.error('Error rejecting rental request:', error);
    res.status(500).json({ 
      message: 'Server Error',
      error: error.message 
    });
  }
};
