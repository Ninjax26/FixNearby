import express from 'express';
import {
  getWorkerSchedule,
  setRecurringAvailability,
  blockTimeSlot,
  getBlockedSlots,
  removeBlockedSlot
} from '../controllers/scheduleController.js';
import { protectWorker } from '../middleware/authMiddleware.js';

const router = express.Router();

// All schedule routes require worker authentication
router.use(protectWorker);

router.get('/', getWorkerSchedule);
router.post('/recurring', setRecurringAvailability);
router.post('/block', blockTimeSlot);
router.get('/blocked', getBlockedSlots);
router.delete('/block/:id', removeBlockedSlot);

export default router;
