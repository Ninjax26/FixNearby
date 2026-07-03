import { useState } from 'react';
import { X } from 'lucide-react';
import FocusTrap from './FocusTrap';

const Star = ({ filled, onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    className="w-6 h-6 cursor-pointer text-amber-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.286 7.018a1 1 0 00.95.69h7.383c.969 0 1.371 1.24.588 1.81l-5.97 4.337a1 1 0 00-.364 1.118l2.286 7.018c.3.921-.755 1.688-1.54 1.118l-5.97-4.337a1 1 0 00-1.175 0l-5.97 4.337c-.784.57-1.838-.197-1.539-1.118l2.286-7.018a1 1 0 00-.364-1.118L2.24 12.445c-.783-.57-.38-1.81.588-1.81h7.383a1 1 0 00.951-.69l2.286-7.018z"
    />
  </svg>
);

const ReviewModal = ({ isOpen, onClose, bookingId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5');
      return;
    }
    if (!reviewText.trim()) {
      setError('Review text cannot be empty');
      return;
    }
    setSubmitting(true);
    setError('');
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('reviewText', reviewText);
    images.forEach((file) => formData.append('images', file));
    try {
      const res = await fetch(`/api/bookings/${bookingId}/review`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to submit review');
      } else {
        // success - close modal
        onClose();
      }
    } catch (e) {
      setError('Network error while submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <FocusTrap active={isOpen}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Submit review"
      >
        <div
          className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            id="close-review-modal"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close review modal"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Leave a Review</h2>
          <div className="flex mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} filled={i <= rating} onClick={() => setRating(i)} />
            ))}
          </div>
          <textarea
            placeholder="Write your review..."
            className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            className="mb-3"
            onChange={handleImageChange}
          />
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
          <button
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      </div>
    </FocusTrap>
  );
};

export default ReviewModal;
