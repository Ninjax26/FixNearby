import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },

  // Either 'User' (customer) or 'Worker'
  recipientModel: {
    type: String,
    required: true,
    enum: ['User', 'Worker'],
    index: true
  },

  type: {
    type: String,
    required: true,
    index: true
  },

  title: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },

  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
    index: true
  },

  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

notificationSchema.index({ recipientId: 1, recipientModel: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;

