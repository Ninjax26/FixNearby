import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // automatic TTL index deletion
  }
}, {
  timestamps: true
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);

export default Blacklist;
