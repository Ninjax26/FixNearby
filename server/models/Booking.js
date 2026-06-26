import mongoose from 'mongoose';

const STATUS_ENUM = ['Pending', 'Accepted', 'In-Progress', 'Completed', 'Cancelled', 'Expired'];

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  service: {
    type: String,
    required: true,
    trim: true,
    maxlength: [120, 'Service must be less than 120 characters']
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  durationHours: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: STATUS_ENUM,
    default: 'Pending'
  },
  address: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  statusHistory: [{
    status: {
      type: String,
      enum: STATUS_ENUM
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'statusHistory.changedByModel'
    },
    changedByModel: {
      type: String,
      enum: ['User', 'Worker']
    },
    note: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes for common access patterns
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ workerId: 1, createdAt: -1 });
bookingSchema.index({ workerId: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
export { STATUS_ENUM };
