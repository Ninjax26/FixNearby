import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { auditLogger } from '../middleware/auditLogger.js';
import AuditLog from '../models/AuditLog.js';
import dotenv from 'dotenv';

dotenv.config();

async function runTests() {
  console.log("--- STARTING AUDIT LOG MIDDLEWARE TESTS ---");
  await connectDB();

  const app = express();
  app.use((req, res, next) => {
    req.user = { _id: new mongoose.Types.ObjectId() };
    next();
  });
  app.use(auditLogger);
  app.get('/api/test-audit', (req, res) => res.status(200).send("OK"));

  const server = createServer(app);
  await new Promise(r => server.listen(5573, r));

  try {
    await fetch("http://localhost:5573/api/test-audit");
    console.log("Request sent. Waiting for audit log database write...");
    await new Promise(r => setTimeout(r, 1000));

    const log = await AuditLog.findOne({ action: 'GET /api/test-audit' });
    if (!log) {
      throw new Error("Audit log entry not found in database.");
    }
    console.log("SUCCESS: Audit log entry verified in database:", log.action);
  } finally {
    await AuditLog.deleteMany({ action: 'GET /api/test-audit' });
    server.close();
    await mongoose.connection.close();
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error("AUDIT LOG TESTS FAILED:", err);
  process.exit(1);
});
