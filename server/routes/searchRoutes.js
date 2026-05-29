import express from 'express';
import {
  searchWorkers,
  getSearchSuggestions,
  getPopularSearches,
} from '../controllers/searchController.js';

const router = express.Router();

/**
 * @route   GET /api/search
 * @desc    Search workers with advanced filters
 * @access  Public
 */
router.get('/', searchWorkers);

/**
 * @route   GET /api/search/suggestions
 * @desc    Get autocomplete suggestions
 * @access  Public
 */
router.get('/suggestions', getSearchSuggestions);

/**
 * @route   GET /api/search/popular
 * @desc    Get popular searches
 * @access  Public
 */
router.get('/popular', getPopularSearches);

export default router;
