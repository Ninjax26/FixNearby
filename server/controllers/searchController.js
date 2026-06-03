import Worker from '../models/Worker.js';

/**
 * Advanced search controller with filtering, sorting, and text search
 */

/**
 * Search workers with advanced filters
 * @route GET /api/search
 * @query {string} q - Search query
 * @query {string} category - Category filter
 * @query {number} minPrice - Minimum price filter
 * @query {number} maxPrice - Maximum price filter
 * @query {number} minRating - Minimum rating filter
 * @query {number} maxDistance - Maximum distance in km
 * @query {string} availability - Availability filter (all, available, busy, offline)
 * @query {string} sort - Sort by (distance, rating, price, availability)
 * @query {number} lat - User latitude for distance calculation
 * @query {number} lon - User longitude for distance calculation
 */
export const searchWorkers = async (req, res) => {
  try {
    const {
      q = '',
      category = 'All',
      minPrice = 0,
      maxPrice = 1000,
      minRating = 0,
      maxDistance = 50,
      availability = 'all',
      sort = 'distance',
      lat,
      lon,
      page = 1,
      limit = 20,
    } = req.query;

    // Build search query
    const searchQuery = {};

    // Text search on name, category, and location
    if (q && q.trim()) {
      searchQuery.$or = [
        { name: { $regex: q.trim(), $options: 'i' } },
        { category: { $regex: q.trim(), $options: 'i' } },
        { location: { $regex: q.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      searchQuery.category = { $regex: category, $options: 'i' };
    }

    // Availability filter
    if (availability && availability !== 'all') {
      searchQuery.availabilityStatus = availability;
    }

    // Execute query
    let workers = await Worker.find(searchQuery);

    // Apply filters that require post-processing
    // Note: In production, price and rating should be fields in the Worker model
    // For now, we'll add mock data for demonstration

    // Add mock data for filtering (in production, these should come from the database)
    workers = workers.map(worker => ({
      ...worker.toObject(),
      price: Math.floor(Math.random() * 80) + 20, // Mock price $20-$100
      rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Mock rating 3.5-5.0
    }));

    // Price filter
    if (minPrice || maxPrice) {
      workers = workers.filter(
        worker => worker.price >= Number(minPrice) && worker.price <= Number(maxPrice)
      );
    }

    // Rating filter
    if (minRating) {
      workers = workers.filter(worker => Number(worker.rating) >= Number(minRating));
    }

    // Distance calculation and filter
    if (lat && lon) {
      workers = workers.map(worker => {
        // Mock coordinates based on location (in production, store actual coordinates)
        const workerLat = Number(lat) + (Math.random() - 0.5) * 0.1;
        const workerLon = Number(lon) + (Math.random() - 0.5) * 0.1;
        
        const distance = calculateDistance(
          Number(lat),
          Number(lon),
          workerLat,
          workerLon
        );
        
        return {
          ...worker,
          distance: distance.toFixed(2),
          coordinates: { lat: workerLat, lon: workerLon },
        };
      });

      // Filter by max distance
      if (maxDistance) {
        workers = workers.filter(worker => Number(worker.distance) <= Number(maxDistance));
      }
    }

    // Sorting
    switch (sort) {
      case 'rating':
        workers.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case 'price':
        workers.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'availability':
        const availabilityOrder = { available: 0, busy: 1, offline: 2 };
        workers.sort((a, b) => 
          availabilityOrder[a.availabilityStatus] - availabilityOrder[b.availabilityStatus]
        );
        break;
      case 'distance':
      default:
        if (lat && lon) {
          workers.sort((a, b) => Number(a.distance) - Number(b.distance));
        }
        break;
    }

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedWorkers = workers.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: workers.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(workers.length / Number(limit)),
      data: paginatedWorkers,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching workers',
      error: error.message,
    });
  }
};

/**
 * Get autocomplete suggestions
 * @route GET /api/search/suggestions
 * @query {string} q - Search query
 */
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q = '' } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        suggestions: [],
      });
    }

    const query = q.trim();

    // Get unique categories
    const categories = await Worker.distinct('category', {
      category: { $regex: query, $options: 'i' },
    });

    // Get worker names
    const workers = await Worker.find(
      { name: { $regex: query, $options: 'i' } },
      { name: 1 }
    ).limit(5);

    // Get locations
    const locations = await Worker.distinct('location', {
      location: { $regex: query, $options: 'i' },
    });

    // Combine and format suggestions
    const suggestions = [
      ...categories.map(cat => ({ type: 'category', value: cat })),
      ...workers.map(w => ({ type: 'worker', value: w.name })),
      ...locations.slice(0, 3).map(loc => ({ type: 'location', value: loc })),
    ].slice(0, 10);

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching suggestions',
      error: error.message,
    });
  }
};

/**
 * Get popular searches
 * @route GET /api/search/popular
 */
export const getPopularSearches = async (req, res) => {
  try {
    // Get most common categories
    const popularCategories = await Worker.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      success: true,
      popular: popularCategories.map(item => item.category),
    });
  } catch (error) {
    console.error('Popular searches error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular searches',
      error: error.message,
    });
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
