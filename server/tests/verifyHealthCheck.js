import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import healthRoutes from '../routes/healthRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

async function runTests() {
  console.log("--- STARTING HEALTH CHECK TESTS ---");
  await connectDB();

  const app = express();
  app.use('/api', healthRoutes);

  const server = createServer(app);
  await new Promise(r => server.listen(5574, r));

  try {
    const res = await fetch("http://localhost:5574/api/health");
    const body = await res.json();
    console.log("Status check response:", body);
    if (body.status !== 'UP' || body.database !== 'connected') {
      throw new Error("Health check invalid status response");
    }
    console.log("SUCCESS: Database connection health check verified.");
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error("HEALTH CHECK TESTS FAILED:", err);
  process.exit(1);
});
