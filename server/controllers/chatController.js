import Message from '../models/Message.js';

/**
 * Retrieves chat history between current user and partnerId using cursor-based pagination.
 * GET /api/chat/history/:partnerId
 * Query params: limit (default 20), cursor (message _id)
 */
export const getChatHistory = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 20;
    const { cursor } = req.query;

    const currentUserId = req.user._id;

    // Build the query to find messages between current user and partnerId
    const query = {
      $or: [
        { senderId: currentUserId, receiverId: partnerId },
        { senderId: partnerId, receiverId: currentUserId }
      ]
    };

    // If cursor exists, fetch messages older than the cursor (created before cursor)
    if (cursor) {
      query._id = { $lt: cursor };
    }

    // Query messages: sort by _id (which correlates to time) descending, limit to requested size
    const messages = await Message.find(query)
      .sort({ _id: -1 })
      .limit(limit);

    // Format the response with the next cursor for the client to retrieve subsequent messages
    const nextCursor = messages.length > 0 ? messages[messages.length - 1]._id : null;
    const hasMore = messages.length === limit;

    res.status(200).json({
      success: true,
      messages,
      nextCursor,
      hasMore
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving chat history',
      error: error.message
    });
  }
};
