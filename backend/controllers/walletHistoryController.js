const WalletHistory = require('../models/WalletHistory');
const User = require('../models/User');

// Get wallet history for a user
exports.getWalletHistory = async (req, res) => {
  try {
    console.log('🔍 Fetching wallet history...');
    const { userId, userType } = req.params;
    console.log(`📝 Request details - UserID: ${userId}, UserType: ${userType}`);
    
    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log(`✅ User found - Email: ${user.email}, Role: ${user.role}`);

    // Find wallet history for the user
    const history = await WalletHistory.find({ 
      userId: user._id,
      userType: user.role
    })
    .sort({ createdAt: -1 })
    .lean();

    console.log(`📊 Found ${history.length} transactions`);

    // Calculate totals
    const totals = {
      topup: 0,
      payment: 0,
      refund: 0
    };

    history.forEach(transaction => {
      if (transaction.status === 'completed') {
        totals[transaction.transactionType] += transaction.amount;
      }
    });

    console.log('💰 Transaction totals:', totals);

    res.status(200).json({
      success: true,
      data: {
        transactions: history,
        totals,
        user: {
          email: user.email,
          role: user.role,
          walletcoin: user.walletcoin || 0
        }
      }
    });
    console.log('✅ Wallet history fetched successfully');
  } catch (error) {
    console.error('❌ Error fetching wallet history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wallet history',
      error: error.message
    });
  }
};

// Add new wallet transaction
exports.addWalletTransaction = async (req, res) => {
  try {
    console.log('➕ Adding new wallet transaction...');
    const {
      userId,
      userType,
      amount,
      transactionType,
      paymentMethod,
      transactionId,
      description
    } = req.body;

    console.log(`📝 Transaction details - Type: ${transactionType}, Amount: ${amount}, Method: ${paymentMethod}`);

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if transaction ID already exists
    const existingTransaction = await WalletHistory.findOne({ transactionId });
    if (existingTransaction) {
      console.log('❌ Duplicate transaction ID');
      return res.status(400).json({
        success: false,
        message: 'Transaction ID already exists'
      });
    }

    const transaction = await WalletHistory.create({
      userId,
      userType,
      amount,
      transactionType,
      paymentMethod,
      transactionId,
      description,
      status: 'completed' // Default to completed for topups
    });

    console.log('✅ Transaction created:', transaction);

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: transaction
    });
  } catch (error) {
    console.error('❌ Error adding transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding transaction',
      error: error.message
    });
  }
};

// Update transaction status
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    const transaction = await WalletHistory.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Transaction status updated successfully',
      data: transaction
    });
  } catch (error) {
    console.error('❌ Error updating transaction status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating transaction status',
      error: error.message
    });
  }
}; 