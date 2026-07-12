import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import { respondToReview } from '../controllers/reviewResponseController.js';
import dotenv from 'dotenv';

dotenv.config();

async function runTests() {
  console.log("--- STARTING REVIEW RESPONSE CONTROLLER TESTS ---");
  await connectDB();

  const r = await Review.create({
    rating: 5,
    reviewText: 'Great plumbing job!',
    bookingReference: new mongoose.Types.ObjectId(),
    user: new mongoose.Types.ObjectId(),
    worker: new mongoose.Types.ObjectId()
  });

  const app = express();
  app.use(express.json());
  app.post('/api/reviews/:reviewId/response', respondToReview);

  const server = createServer(app);
  await new Promise(r => server.listen(5579, r));

  try {
    const res = await fetch("http://localhost:5579/api/reviews/" + r._id + "/response", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseText: 'Thank you for your feedback!' })
    });
    const body = await res.json();
    console.log("Review response reply status:", res.status);
    if (res.status !== 200 || !body.success) {
      throw new Error("Failed to post worker reply to review.");
    }
    
    const updated = await Review.findById(r._id);
    if (!updated.workerResponse || updated.workerResponse.text !== 'Thank you for your feedback!') {
      throw new Error("Worker reply was not stored on Review model.");
    }
    console.log("SUCCESS: Worker response review integration verified.");
  } finally {
    await Review.deleteOne({ _id: r._id });
    server.close();
    await mongoose.connection.close();
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error("REVIEW RESPONSE TESTS FAILED:", err);
  process.exit(1);
});
