import Earning from '../models/Earning.js';
import mongoose from 'mongoose';

// @desc    Get earnings dashboard stats for authenticated worker
// @route   GET /api/earnings/dashboard/stats
// @access  Private (Worker)
export const getEarningsDashboard = async (req, res) => {
  try {
    const workerId = req.worker._id;

    const stats = await Earning.aggregate([
      { $match: { workerId: new mongoose.Types.ObjectId(workerId) } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$netAmount' },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$netAmount', 0] }
          },
          paidAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$netAmount', 0] }
          },
          bookingCount: { $sum: 1 }
        }
      }
    ]);

    // This month's earnings
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyResult = await Earning.aggregate([
      {
        $match: {
          workerId: new mongoose.Types.ObjectId(workerId),
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          thisMonth: { $sum: '$netAmount' }
        }
      }
    ]);

    const overview = stats.length > 0 ? stats[0] : {
      totalEarnings: 0, pendingAmount: 0, paidAmount: 0, bookingCount: 0
    };

    res.status(200).json({
      success: true,
      totalEarnings: overview.totalEarnings || 0,
      pendingAmount: overview.pendingAmount || 0,
      paidAmount: overview.paidAmount || 0,
      thisMonth: monthlyResult.length > 0 ? monthlyResult[0].thisMonth : 0,
      bookingCount: overview.bookingCount || 0
    });
  } catch (error) {
    console.error('Error fetching earnings dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching earnings stats'
    });
  }
};

// @desc    Get paginated earnings history
// @route   GET /api/earnings/history
// @access  Private (Worker)
export const getEarningsHistory = async (req, res) => {
  try {
    const workerId = req.worker._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { workerId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const total = await Earning.countDocuments(filter);
    const earnings = await Earning.find(filter)
      .populate('bookingId', 'service scheduledTime')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      earnings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching earnings history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching earnings history'
    });
  }
};

// @desc    Request a payout from available paid earnings
// @route   POST /api/earnings/payout
// @access  Private (Worker)
export const requestPayout = async (req, res) => {
  try {
    const workerId = req.worker._id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid payout amount greater than zero'
      });
    }

    // Find all paid (not yet requested) earnings for this worker
    const paidEarnings = await Earning.find({
      workerId,
      status: 'paid'
    }).sort({ createdAt: 1 });

    const totalAvailable = paidEarnings.reduce((sum, e) => sum + e.netAmount, 0);

    if (totalAvailable < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ₹${totalAvailable.toFixed(2)}, requested: ₹${amount.toFixed(2)}`
      });
    }

    // Mark oldest paid earnings as pending (payout requested)
    let remaining = amount;
    for (const earning of paidEarnings) {
      if (remaining <= 0) break;
      if (earning.netAmount <= remaining) {
        earning.status = 'pending';
        earning.payoutMethod = 'bank_transfer';
        remaining -= earning.netAmount;
      } else {
        // Partially - create a new earning for the requested portion
        const splitAmount = remaining;
        const ratio = splitAmount / earning.netAmount;
        const splitPlatformFee = earning.platformFee * ratio;

        await Earning.create({
          workerId,
          bookingId: earning.bookingId,
          amount: earning.amount * ratio,
          platformFee: splitPlatformFee,
          netAmount: splitAmount,
          status: 'pending',
          payoutMethod: 'bank_transfer',
          description: `Partial payout from earning ${earning._id}`
        });

        earning.netAmount -= splitAmount;
        earning.amount -= earning.amount * ratio;
        earning.platformFee -= splitPlatformFee;
        remaining = 0;
      }
      await earning.save();
    }

    res.status(200).json({
      success: true,
      message: `Payout request for ₹${amount.toFixed(2)} has been submitted successfully`,
      requestedAmount: amount
    });
  } catch (error) {
    console.error('Error processing payout request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing payout request'
    });
  }
};
