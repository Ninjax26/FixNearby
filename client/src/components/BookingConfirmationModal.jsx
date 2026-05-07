import { Link } from "react-router-dom";

const BookingConfirmationModal = ({ isOpen, onClose, bookingDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Success Icon */}
        <div className="text-center mb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Booking Confirmed! 🎉
        </h2>

        <div className="border-t border-b py-4 mb-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-semibold">{bookingDetails?.service || "Service Name"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Worker:</span>
              <span className="font-semibold">{bookingDetails?.worker || "Worker Name"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold">{bookingDetails?.date || new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-semibold">{bookingDetails?.time || "10:00 AM"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Price:</span>
              <span className="font-semibold text-green-600">{bookingDetails?.price || "$XX/hr"}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/bookings"
            className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={onClose}
          >
            View Bookings
          </Link>
          <Link
            to="/"
            className="flex-1 bg-gray-200 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;