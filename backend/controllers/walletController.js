const User = require('../models/User');
const RentalRequest = require('../models/RentalRequest');
const Property = require('../models/Property');
const PaymentHistory = require('../models/PaymentHistory');

// Get wallet details
exports.getWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletcoin: user.walletcoin || 0,
      phoneNumber: user.phoneNumber
    });
  } catch (error) {
    console.error('Error getting wallet:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const WalletHistory = require('../models/WalletHistory');

// Add coins to wallet
exports.addCoins = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }

    if (amount > 100000) {
      return res.status(400).json({ msg: 'Amount cannot exceed 100000' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.walletcoin = (user.walletcoin || 0) + Number(amount);
    await user.save();

    // Create wallet history record
    const history = new WalletHistory({
      userId: user._id,
      userType: user.role,
      amount: Number(amount),
      transactionType: 'topup',
      paymentMethod: paymentMethod || 'card',
      transactionId: `TOPUP_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      description: `Added ${amount} coins to wallet`,
      status: 'completed'
    });
    await history.save();

    res.status(200).json({ 
      msg: `Successfully added ${amount} coins to wallet`,
      walletcoin: user.walletcoin
    });
  } catch (error) {
    console.error('Error adding coins:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Deduct coins from wallet
exports.deductCoins = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ msg: 'Amount must be greater than 0' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if ((user.walletcoin || 0) < amount) {
      return res.status(400).json({ msg: 'Insufficient balance' });
    }

    user.walletcoin = (user.walletcoin || 0) - Number(amount);
    await user.save();

    // Create wallet history record
    const history = new WalletHistory({
      userId: user._id,
      userType: user.role,
      amount: Number(amount),
      transactionType: 'payment',
      paymentMethod: 'wallet', // internal deduction
      transactionId: `DEDUCT_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      description: reason || `Deducted ${amount} coins from wallet`,
      status: 'completed'
    });
    await history.save();

    res.status(200).json({ 
      msg: `Successfully deducted ${amount} coins`,
      walletcoin: user.walletcoin
    });
  } catch (error) {
    console.error('Error deducting coins:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Request advance payment
exports.requestAdvance = async (req, res) => {
  try {
    const { rentalRequestId } = req.params;
    const { amount } = req.body;

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const rentalRequest = await RentalRequest.findById(rentalRequestId)
      .populate('propertyId');
    
    if (!rentalRequest) {
      return res.status(404).json({ message: 'Rental request not found' });
    }

    if (rentalRequest.status !== 'Approved') {
      return res.status(400).json({ message: 'Rental request must be approved first' });
    }

    // Get tenant and landlord from their emails
    const tenant = await User.findOne({ email: rentalRequest.tenantEmail });
    const landlord = await User.findOne({ email: rentalRequest.landlordEmail });

    if (!tenant || !landlord) {
      return res.status(404).json({ message: 'Tenant or landlord not found' });
    }

    // Check if there's already a pending advance request
    const existingPayment = await PaymentHistory.findOne({
      rentalRequestId,
      type: 'advance',
      status: 'pending'
    });

    if (existingPayment) {
      return res.status(400).json({ message: 'An advance payment request is already pending for this rental' });
    }

    // Create new payment history
    const paymentHistory = new PaymentHistory({
      rentalRequestId,
      propertyId: rentalRequest.propertyId._id,
      tenantId: tenant._id,
      landlordId: landlord._id,
      amount: Number(amount),
      type: 'advance',
      status: 'pending'
    });

    await paymentHistory.save();

    // Update rental request to indicate advance request
    rentalRequest.hasAdvanceRequest = true;
    await rentalRequest.save();

    res.status(200).json({
      message: 'Advance payment requested successfully',
      paymentHistory
    });
  } catch (error) {
    console.error('Error requesting advance:', error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// Pay advance
exports.payAdvance = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { tenantId } = req.body;

    const paymentHistory = await PaymentHistory.findById(paymentId);
    if (!paymentHistory) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (paymentHistory.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    const tenant = await User.findById(tenantId);
    const landlord = await User.findById(paymentHistory.landlordId);

    if (!tenant || !landlord) {
      return res.status(404).json({ message: 'User not found' });
    }

    if ((tenant.walletcoin || 0) < paymentHistory.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    tenant.walletcoin = (tenant.walletcoin || 0) - paymentHistory.amount;
    landlord.walletcoin = (landlord.walletcoin || 0) + paymentHistory.amount;
    paymentHistory.status = 'completed';

    await Promise.all([
      tenant.save(),
      landlord.save(),
      paymentHistory.save()
    ]);

    res.status(200).json({
      message: 'Advance payment completed successfully',
      paymentHistory
    });
  } catch (error) {
    console.error('Error processing advance payment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const paymentHistory = await PaymentHistory.find({
      $or: [{ tenantId: userId }, { landlordId: userId }]
    })
    .populate('propertyId', 'title description type address location area rooms bathrooms price advance phone')
    .populate('tenantId', 'name email')
    .populate('landlordId', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json(paymentHistory);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get pending payments
exports.getPendingPayments = async (req, res) => {
  try {
    const { rentalRequestId } = req.params;

    const pendingPayments = await PaymentHistory.find({
      rentalRequestId,
      status: 'pending'
    })
    .populate('propertyId', 'title location')
    .populate('tenantId', 'name email')
    .populate('landlordId', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json(pendingPayments);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
