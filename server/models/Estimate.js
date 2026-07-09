import mongoose from 'mongoose';

const estimateSchema = new mongoose.Schema({
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
  profession: {
    type: String,
    required: true
  },
  inputs: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  materials: [
    {
      name: String,
      qty: Number,
      unit: String,
      unitCost: Number,
      subtotal: Number
    }
  ],
  laborHours: Number,
  laborCost: Number,
  materialCost: Number,
  totalCost: Number,
  summary: String,
  status: {
    type: String,
    enum: ['preview', 'confirmed'],
    default: 'preview'
  }
}, {
  timestamps: true
});

const Estimate = mongoose.model('Estimate', estimateSchema);
export default Estimate;
