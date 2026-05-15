import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Connect to Database
// TODO: Uncomment when ready to connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);

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
