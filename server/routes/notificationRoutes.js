import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { sendNotification, listMyNotifications, markNotificationRead } from '../controllers/notificationController.js';

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// POST /api/notifications/send
router.post('/send', sendNotification);

// GET /api/notifications
router.get('/', listMyNotifications);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', markNotificationRead);

export default router;

