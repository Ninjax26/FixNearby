import mongoose from 'mongoose';

const earningSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  platformFee: {
    type: Number,
    required: true,
    min: 0
  },
  netAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  payoutDate: {
    type: Date
  },
  payoutMethod: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound indexes for common queries
earningSchema.index({ workerId: 1, createdAt: -1 });
earningSchema.index({ status: 1 });
earningSchema.index({ workerId: 1, status: 1, createdAt: -1 });

const Earning = mongoose.model('Earning', earningSchema);
export default Earning;
