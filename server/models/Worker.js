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
  }
}, {
  timestamps: true
});

const Worker = mongoose.model('Worker', workerSchema);

export default Worker;