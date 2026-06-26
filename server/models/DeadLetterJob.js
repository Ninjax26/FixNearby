import mongoose from 'mongoose';

const deadLetterJobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true
  },
  queueName: {
    type: String,
    required: true
  },
  jobName: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  failedReason: {
    type: String
  },
  stacktrace: {
    type: [String]
  },
  failedAt: {
    type: Date,
    default: Date.now
  }
});

const DeadLetterJob = mongoose.model('DeadLetterJob', deadLetterJobSchema);
export default DeadLetterJob;
