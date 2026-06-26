import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { rating, reviewText, bookingReference } = req.body;

    if (!rating || !reviewText || !bookingReference) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating, review text, and booking reference'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingReference)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking reference ID'
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingReference);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Restrict submission to users who completed bookings with that specific worker
    if (booking.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed bookings'
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only review your own bookings'
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingReference });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'A review has already been submitted for this booking'
      });
    }

    // Create review
    const review = await Review.create({
      rating,
      reviewText,
      bookingReference,
      user: req.user._id,
      worker: booking.worker
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// @desc    Get all reviews (optionally filtered by workerId)
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const { workerId } = req.query;
    let query = {};

    if (workerId) {
      if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid worker ID'
        });
      }
      query.worker = workerId;
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('worker', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// @desc    Get specific review by ID
// @route   GET /api/reviews/:id
// @access  Public
export const getReviewById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    const review = await Review.findById(req.params.id)
      .populate('user', 'name email')
      .populate('worker', 'name category');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Owner check
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    if (rating !== undefined) review.rating = rating;
    if (reviewText !== undefined) review.reviewText = reviewText;

    await review.save(); // triggers post('save') to recalculate rating

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Owner check
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const workerId = review.worker;
    await review.deleteOne();

    // Recalculate average rating after deletion
    await Review.calculateAverageRating(workerId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};
