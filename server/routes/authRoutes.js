import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  registerWorker,
  loginWorker,
  getWorkerProfile,
  forgotUserPassword,
  resetUserPassword,
  forgotWorkerPassword,
  resetWorkerPassword,
  logoutUser
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/authRateLimiter.js';

const router = express.Router();

router.post('/register', authRateLimiter, registerUser);
router.post('/login', authRateLimiter, loginUser);
router.post('/worker/register', authRateLimiter, registerWorker);
router.post('/worker/login', authRateLimiter, loginWorker);
router.post('/forgot-password', authRateLimiter, forgotUserPassword);
router.post('/reset-password/:token', authRateLimiter, resetUserPassword);
router.post('/worker/forgot-password', authRateLimiter, forgotWorkerPassword);
router.post('/worker/reset-password/:token', authRateLimiter, resetWorkerPassword);
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/worker/profile', authMiddleware, getWorkerProfile);
router.post('/logout', authMiddleware, logoutUser);

export default router;
