import Review from '../models/Review.js';

export const respondToReview = async (req, res) => {
  const { reviewId } = req.params;
  const { responseText } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.workerResponse = {
      text: responseText,
      respondedAt: new Date()
    };
    await review.save();

    res.status(200).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
