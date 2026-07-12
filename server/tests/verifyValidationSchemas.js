import express from 'express';
import { createServer } from 'http';
import { validateRegistrationPayload } from '../middleware/requestValidator.js';

async function runTests() {
  console.log("--- STARTING SCHEMAS VALIDATION TESTS ---");
  const app = express();
  app.use(express.json());
  app.post('/api/register', validateRegistrationPayload, (req, res) => {
    res.status(200).json({ success: true });
  });

  const server = createServer(app);
  await new Promise(r => server.listen(5575, r));

  try {
    const invalidRes = await fetch("http://localhost:5575/api/register", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'A', email: 'test.com', password: '123' })
    });
    const body = await invalidRes.json();
    console.log("Invalid status output:", invalidRes.status, body.message);
    if (invalidRes.status !== 400 || body.success) {
      throw new Error("Invalid payload did not throw 400 Bad Request error.");
    }
    console.log("SUCCESS: Payload validation logic correctly blocks malformed requests.");
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error("VALIDATION SCHEMA TESTS FAILED:", err);
  process.exit(1);
});
