import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import crypto from 'crypto';

// @desc    Create a payment intent for a booking
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { bookingId, amount, method } = req.body;

    if (!bookingId || !amount || !method) {
      return res.status(400).json({
        success: false,
        message: 'bookingId, amount, and method are required'
      });
    }

    const validMethods = ['card', 'bank_transfer', 'wallet'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Allowed: ${validMethods.join(', ')}`
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    // Verify the booking exists and belongs to the current user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking'
      });
    }

    // Check if a pending or completed payment already exists for this booking
    const existingPayment = await Payment.findOne({
      bookingId,
      status: { $in: ['pending', 'completed'] }
    });

    if (existingPayment && existingPayment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid for'
      });
    }

    // Generate a mock Stripe-like client secret
    const secretHex = crypto.randomBytes(16).toString('hex');
    const clientSecret = `pi_${secretHex}_secret_${crypto.randomBytes(8).toString('hex')}`;

    let payment;
    if (existingPayment) {
      // Update existing pending payment with new details
      existingPayment.amount = amount;
      existingPayment.method = method;
      await existingPayment.save();
      payment = existingPayment;
    } else {
      payment = await Payment.create({
        userId: req.user._id,
        bookingId,
        amount,
        method,
        status: 'pending'
      });
    }

    res.status(201).json({
      success: true,
      payment,
      clientSecret
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm a payment (mock Stripe webhook)
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = async (req, res, next) => {
  try {
    const { paymentId, transactionId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'paymentId is required'
      });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to confirm this payment'
      });
    }

    if (payment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment is already completed'
      });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Cannot confirm a refunded payment'
      });
    }

    // In a real implementation this would be called by Stripe's webhook.
    // For the mock flow, we simulate a successful charge.
    payment.status = 'completed';
    payment.transactionId = transactionId || `txn_${crypto.randomBytes(12).toString('hex')}`;
    payment.paymentDate = new Date();

    // Generate a mock receipt URL
    const receiptId = crypto.randomBytes(8).toString('hex');
    payment.receiptUrl = `/api/payments/receipt/${receiptId}`;

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get paginated payment history for current user
// @route   GET /api/payments/history
// @access  Private
export const getPaymentHistory = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find({ userId: req.user._id })
        .populate('bookingId', 'service scheduledTime')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Payment.countDocuments({ userId: req.user._id })
    ]);

    res.status(200).json({
      success: true,
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('bookingId')
      .populate('userId', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Only allow the owner or an admin to view payment details
    if (payment.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request a refund for a completed payment
// @route   POST /api/payments/:id/refund
// @access  Private
export const requestRefund = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Refund reason is required'
      });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to request a refund for this payment'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded'
      });
    }

    // In production this would call the Stripe refund API.
    // For now we just mark it in our DB.
    payment.status = 'refunded';
    payment.refundReason = reason.trim();
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Refund request submitted successfully',
      payment
    });
  } catch (error) {
    next(error);
  }
};
