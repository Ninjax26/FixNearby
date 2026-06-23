import express from 'express';
import { registerWorker, loginWorker, getWorkers, getWorkerById, getWorkerProfile, recalculateKarmaScoresController } from '../controllers/workerController.js';
import { protectWorker } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', upload.single('profilePicture'), registerWorker);
router.post('/login', loginWorker);
router.get('/profile', protectWorker, getWorkerProfile);
router.post('/recalculate-karma', protectWorker, recalculateKarmaScoresController);
router.get('/', getWorkers);
router.get('/:id', getWorkerById);

export default router;
