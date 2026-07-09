import express from "express";
import {
  getWorkerAvailabilityStatus,
  updateWorkerAvailabilityStatus,
} from "../controllers/workerController.js";
import { protectWorker } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/status", protectWorker, updateWorkerAvailabilityStatus);
router.get("/status/:workerId", getWorkerAvailabilityStatus);

export default router;
