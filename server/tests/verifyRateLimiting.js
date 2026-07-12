import express from 'express';
import { createServer } from 'http';
import { globalApiLimiter, bookingRateLimiter } from '../middleware/rateLimiter.js';

async function runTests() {
  console.log("--- STARTING RATE LIMITING MIDDLEWARE TESTS ---");
  const app = express();
  app.use(globalApiLimiter);
  app.post('/api/bookings', bookingRateLimiter, (req, res) => {
    res.status(200).json({ success: true });
  });

  const server = createServer(app);
  await new Promise(r => server.listen(5571, r));
  console.log("Test server running on port 5571");

  try {
    console.log("Testing Global Limit (sending 105 requests)...");
    let hitLimit = false;
    for (let i = 0; i < 105; i++) {
      const res = await fetch("http://localhost:5571/api/bookings", { method: 'POST' });
      if (res.status === 429) {
        hitLimit = true;
        break;
      }
    }
    if (hitLimit) {
      console.log("SUCCESS: Global rate limiter correctly triggered 429.");
    } else {
      throw new Error("Global rate limiter did not trigger 429 after 100 requests");
    }
  } finally {
    setTimeout(() => {
      process.exit(0);
    }, 100);
  }
}

runTests().then(() => {
  console.log("RATE LIMITING TESTS COMPLETED SUCCESSFULLY");
}).catch(err => {
  console.error("RATE LIMITING TESTS FAILED:", err);
  process.exit(1);
});
