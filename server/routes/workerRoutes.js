import express from 'express';
import { registerWorker, getWorkers } from '../controllers/workerController.js';

const router = express.Router();

router.post('/register', registerWorker);
router.get('/', getWorkers);

export default router;