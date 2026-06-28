import express from 'express';
import { registerWorker, loginWorker, getWorkers, getWorkerById, getWorkerProfile, getNearbyWorkers, recalculateKarmaScoresController, getWorkerAvailability } from '../controllers/workerController.js';
import { protectWorker } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', upload.single('profilePicture'), registerWorker);
router.post('/login', loginWorker);
router.get('/profile', protectWorker, getWorkerProfile);
router.get('/nearby', getNearbyWorkers);
router.post('/recalculate-karma', protectWorker, recalculateKarmaScoresController);
router.get('/', getWorkers);
router.get('/:id', getWorkerById);
router.get('/:id/availability', getWorkerAvailability);

export default router;
