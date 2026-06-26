import express from 'express';
import { getChatHistory } from '../controllers/chatController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Get paginated chat history between current user and partnerId
router.get('/history/:partnerId', protect, getChatHistory);

export default router;
