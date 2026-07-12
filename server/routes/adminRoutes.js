import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAdminStats, getAdminUsers, getAdminWorkers } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.get('/workers', getAdminWorkers);

export default router;
