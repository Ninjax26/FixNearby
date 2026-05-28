import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,

  registerWorker,
  loginWorker,
  getWorkerProfile,
} from "../controllers/authController.js";

import {
  protect,
  protectWorker,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

{/* USER AUTH ROUTES*/}

router.post("/register", registerUser);

router.post("/login", loginUser);

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
  upload.single("profilePicture"),
  registerWorker
);

// WORKER LOGIN
router.post(
  "/worker/login",
  loginWorker
);

// WORKER PROFILE
router.get(
  "/worker/profile",
  protectWorker,
  getWorkerProfile
);

export default router;