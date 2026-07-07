import { validateRegistrationPayload } from '../middleware/requestValidator.js';
import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotUserPassword,
  resetUserPassword,
  forgotWorkerPassword,
  resetWorkerPassword,
  logoutUser
} from '../controllers/authController.js';
import {
  registerWorker,
  loginWorker,
  getWorkerProfile
} from '../controllers/workerController.js';

import {
  protect,
  protectWorker,
} from '../middleware/authMiddleware.js';

import upload from '../middleware/uploadMiddleware.js';

import {
  userLoginLimiter,
  userRegisterLimiter,
  workerLoginLimiter,
  workerRegisterLimiter,
  passwordResetLimiter
} from '../middleware/authRateLimiter.js';
import { validateRegistration, validateLogin } from '../middleware/validationMiddleware.js';

const router = express.Router();

{/* USER AUTH ROUTES */}

router.post('/register', validateRegistrationPayload, userRegisterLimiter, validateRegistration, registerUser);
router.post('/login', userLoginLimiter, validateLogin, loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/logout', protect, logoutUser);

{/* WORKER AUTH ROUTES */}

// WORKER REGISTER
router.post(
  '/worker/register',
  workerRegisterLimiter,
  upload.single('profilePicture'),
  validateRegistration,
  registerWorker
);

// WORKER LOGIN
router.post(
  '/worker/login',
  workerLoginLimiter,
  validateLogin,
  loginWorker
);

// WORKER PROFILE
router.get(
  '/worker/profile',
  protectWorker,
  getWorkerProfile
);

router.post(
  '/forgot-password',
  passwordResetLimiter,
  forgotUserPassword
);

router.put(
  '/reset-password/:token',
  resetUserPassword
);

router.post(
  '/worker/forgot-password',
  passwordResetLimiter,
  forgotWorkerPassword
);

router.put(
  '/worker/reset-password/:token',
  resetWorkerPassword
);

export default router;
