// Worker route schema validations enabled
import express from 'express';
import { registerWorker, loginWorker, getWorkers, getWorkerById, getWorkerProfile, getNearbyWorkers, recalculateKarmaScoresController, getWorkerAvailability, getWorkerReviews, getWorkerDashboardStats, getWorkersBatch } from '../controllers/workerController.js';
import { registerWorker, loginWorker, getWorkers, getWorkerById, getWorkerProfile, getNearbyWorkers, recalculateKarmaScoresController, getWorkerAvailability, getWorkerReviews, getWorkerDashboardStats, getWorkersByBounds, getWorkerClusters } from '../controllers/workerController.js';
import { protectWorker } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { validateGeoCoordinates } from '../middleware/geoValidator.js';

const router = express.Router();

router.post('/batch', getWorkersBatch);
router.post('/register', upload.single('profilePicture'), validateGeoCoordinates, registerWorker);
router.post('/login', loginWorker);
router.get('/profile', protectWorker, getWorkerProfile);
router.get('/nearby', getNearbyWorkers);
router.get('/map-bounds', getWorkersByBounds);
router.get('/clusters', getWorkerClusters);
router.get('/dashboard/stats', protectWorker, getWorkerDashboardStats);
router.post('/recalculate-karma', protectWorker, recalculateKarmaScoresController);
router.get('/', getWorkers);
router.get('/:id', getWorkerById);
router.get('/:id/availability', getWorkerAvailability);
router.get('/:id/reviews', getWorkerReviews);

export default router;
