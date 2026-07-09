import Message from '../models/Message.js';

export const handleSendMessage = (io, socket, userId, userType) => async (data, callback) => {
  try {
    const { receiverId, receiverModel, text, timestamp } = data;
    if (!receiverId || !receiverModel || !text) {
      if (callback) callback({ success: false, error: 'Invalid message payload' });
      return;
    }
    if (!['User', 'Worker'].includes(receiverModel)) {
      if (callback) callback({ success: false, error: 'Invalid receiver model' });
      return;
    }
    // Simple ordering check – reject if timestamp older than last stored (optional)
    if (timestamp) {
      const lastMsg = await Message.findOne({
        $or: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId }
        ]
      }).sort({ createdAt: -1 });
      if (lastMsg && new Date(timestamp) < lastMsg.createdAt) {
        if (callback) callback({ success: false, error: 'Out‑of‑order message' });
        return;
      }
    }
    // Persist message
    const message = await Message.create({
      senderId: userId,
      senderModel: userType,
      receiverId,
      receiverModel,
      text,
      createdAt: timestamp ? new Date(timestamp) : undefined
    });
    const msgData = {
      _id: message._id,
      senderId: message.senderId,
      senderModel: message.senderModel,
      receiverId: message.receiverId,
      receiverModel: message.receiverModel,
      text: message.text,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };
    io.to(receiverId).emit('receiveMessage', msgData);
    io.to(userId).emit('receiveMessage', msgData);
    // Ack to sender
    socket.emit('message_ack', { messageId: message._id });
    if (callback) callback({ success: true, message: msgData });
  } catch (err) {
    if (callback) callback({ success: false, error: err.message });
  }
};

export const handleTyping = (io, socket, userId) => (data) => {
  const { receiverId } = data;
  if (receiverId) {
    io.to(receiverId).emit('typing', { senderId: userId });
  }
};
