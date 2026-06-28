import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All favorites routes require authentication
router.use(protect);

router.route('/')
  .get(getFavorites);

router.route('/:workerId')
  .post(addFavorite)
  .delete(removeFavorite);

export default router;
