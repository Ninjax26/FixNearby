import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config(); // Adjust if .env is in server root

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
// TODO: Uncomment when ready to connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);

// Protected test route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Access granted",
    user: req.user
  });
});

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'FixNearby API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
