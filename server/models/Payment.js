import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
    trim: true
  },
  method: {
    type: String,
    enum: {
      values: ['card', 'bank_transfer', 'wallet'],
      message: '{VALUE} is not a valid payment method'
    },
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    default: null
  },
  receiptUrl: {
    type: String,
    default: null
  },
  paymentDate: {
    type: Date,
    default: null
  },
  refundReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Query patterns for the payments collection
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
