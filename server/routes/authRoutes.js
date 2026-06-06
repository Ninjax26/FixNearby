import express from "express";

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
  resetWorkerPassword
} from "../controllers/authController.js";

import {
  protect,
  protectWorker,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

import { userLoginLimiter, userRegisterLimiter, workerLoginLimiter, workerRegisterLimiter } from "../middleware/authRateLimiter.js";
import { validateRegistration, validateLogin } from "../middleware/validationMiddleware.js";

const router = express.Router();

{/* USER AUTH ROUTES*/}

router.post("/register", userRegisterLimiter, validateRegistration, registerUser);

router.post("/login", userLoginLimiter, validateLogin, loginUser);

router.get(
  "/profile",
  protect,
  getUserProfile
);

router.put(
  "/profile",
  protect,
  updateUserProfile
);

{/* WORKER AUTH ROUTES */}

// WORKER REGISTER
router.post(
  "/worker/register",
  workerRegisterLimiter,
  upload.single("profilePicture"),
  validateRegistration,
  registerWorker
);

// WORKER LOGIN
router.post(
  "/worker/login",
  workerLoginLimiter,
  validateLogin,
  loginWorker
);

// WORKER PROFILE
router.get(
  "/worker/profile",
  protectWorker,
  getWorkerProfile
);

router.post(
  "/forgot-password",
  forgotUserPassword
);

router.put(
  "/reset-password/:token",
  resetUserPassword
);

router.post(
  "/worker/forgot-password",
  forgotWorkerPassword
);

router.put(
  "/worker/reset-password/:token",
  resetWorkerPassword
);

export default router;