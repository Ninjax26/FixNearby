import SearchPreset from '../models/SearchPreset.js';

/**
 * Save a search preset/template
 * @route   POST /api/search/presets
 * @access  Private
 */
export const createPreset = async (req, res) => {
  try {
    const { name, query, filters } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Preset name is required.'
      });
    }

    const userModel = req.user.constructor.modelName || (req.user.category ? 'Worker' : 'User');

    const preset = await SearchPreset.create({
      user: req.user._id,
      userModel,
      name: name.trim(),
      query: query || '',
      filters: {
        category: filters?.category || 'All',
        minPrice: filters?.minPrice !== undefined ? Number(filters.minPrice) : 0,
        maxPrice: filters?.maxPrice !== undefined ? Number(filters.maxPrice) : 100,
        minRating: filters?.minRating !== undefined ? Number(filters.minRating) : 0,
        maxDistance: filters?.maxDistance !== undefined ? Number(filters.maxDistance) : 50,
        availability: filters?.availability || 'all',
        sortBy: filters?.sortBy || 'distance'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Search preset saved successfully.',
      preset
    });
  } catch (error) {
    console.error('Error creating search preset:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

/**
 * Get all search presets for current user
 * @route   GET /api/search/presets
 * @access  Private
 */
export const getPresets = async (req, res) => {
  try {
    const presets = await SearchPreset.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      presets
    });
  } catch (error) {
    console.error('Error fetching search presets:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

/**
 * Delete a search preset
 * @route   DELETE /api/search/presets/:id
 * @access  Private
 */
export const deletePreset = async (req, res) => {
  try {
    const preset = await SearchPreset.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!preset) {
      return res.status(404).json({
        success: false,
        message: 'Search preset not found or unauthorized.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Search preset deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting search preset:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};
