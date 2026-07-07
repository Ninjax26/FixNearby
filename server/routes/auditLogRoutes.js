import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Currently protecting with standard protect middleware
router.get('/', protect, getAuditLogs);

export default router;
