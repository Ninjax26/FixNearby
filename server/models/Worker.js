import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },

  // ── Issue #215: Real-Time Worker Availability Status ──────────
  availabilityStatus: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
  // ─────────────────────────────────────────────────────────────

}, {
  timestamps: true
});

const Worker = mongoose.model('Worker', workerSchema);

export default Worker;