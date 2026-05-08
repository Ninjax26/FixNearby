import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useToast from "../hooks/useToast";
import EmptyState from "../components/EmptyState";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({}); // For individual button loading
  const { showToast } = useToast();
import { useState } from "react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({}); // For individual button loading
const StarRating = ({ rating, onRatingChange, size = "md" }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const [activeReview, setActiveReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const statusOptions = [
    "All",
    "Pending",
    "Completed",
    "Cancelled",
  ];

  // ---------------- LOAD BOOKINGS ----------------

  useEffect(() => {
    setLoading(true);

    try {
      const saved = localStorage.getItem("bookings");

      if (saved) {
        setBookings(JSON.parse(saved));
      } else {
        const demo = [
          {
            id: "BK-101",
            worker: "Jane Smith",
            service: "Plumbing",
            date: "2026-05-12",
            status: "Pending",
            price: 80,
            arrivalTime: "30 mins",
            address: "221B Main Street",
            payment: "Cash",
            workerImage:
              "https://i.pravatar.cc/150?img=32",
            verified: true,
            instantBooking: true,
          },

          {
            id: "BK-102",
            worker: "John Doe",
            service: "Electrical",
            date: "2026-05-18",
            status: "Completed",
            price: 120,
            arrivalTime: "1 hour",
            address: "742 Evergreen Terrace",
            payment: "UPI",
            workerImage:
              "https://i.pravatar.cc/150?img=15",
            verified: true,
            instantBooking: true,
          },

          {
            id: "BK-103",
            worker: "Mike Johnson",
            service: "Carpentry",
            date: "2026-05-22",
            status: "Cancelled",
            price: 65,
            arrivalTime: "45 mins",
            address: "Sunset Avenue",
            payment: "Card",
            workerImage:
              "https://i.pravatar.cc/150?img=11",
            verified: false,
            instantBooking: false,
          },
        ];

        setBookings(demo);

        localStorage.setItem(
          "bookings",
          JSON.stringify(demo)
        );
      }
    } catch (e) {
      setError("Failed to load bookings");
    }

    setLoading(false);
  }, []);

  const handleCancel = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      // TODO: API call to cancel booking
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      const updated = bookings.map((b) =>
        b.id === id ? { ...b, status: "Cancelled" } : b
      );
      setBookings(updated);
      showToast('Booking cancelled successfully.', 'success');
    } catch (error) {
      console.error('Cancel failed:', error);
      showToast('Failed to cancel booking. Please try again.', 'error');
    } catch (error) {
      console.error('Cancel failed:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReviewSubmit = async (id) => {
    if (rating === 0) return alert("Please select a rating");

    setActionLoading(prev => ({ ...prev, [`review-${id}`]: true }));
    try {
      // TODO: API call to submit review
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      const updated = bookings.map((b) =>
        b.id === id ? { ...b, review: { rating, comment } } : b
      );

      setBookings(updated);
      setActiveReview(null);
      setRating(0);
      setComment("");
      showToast('Review submitted successfully!', 'success');
    } catch (error) {
      console.error('Review submit failed:', error);
      showToast('Failed to submit review. Please try again.', 'error');
    } catch (error) {
      console.error('Review submit failed:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`review-${id}`]: false }));
    }
  // ---------------- SAVE BOOKINGS ----------------

  useEffect(() => {
    localStorage.setItem(
      "bookings",
      JSON.stringify(bookings)
    );
  }, [bookings]);

  // ---------------- CANCEL BOOKING ----------------

  const handleCancel = (id) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: "Cancelled",
            }
          : b
      )
    );
  };

  // ---------------- REVIEW ----------------

  const handleReviewSubmit = (id) => {
    if (!rating) {
      return alert("Please select rating");
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              review: {
                rating,
                comment,
              },
            }
          : b
      )
    );

    setActiveReview(null);
    setRating(0);
    setComment("");
  };

  // ---------------- FILTERED ----------------

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.worker
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        b.service
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "All" ||
        b.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  // ---------------- STATUS STYLE ----------------
    return matchSearch && matchStatus;
  });
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const starSize = sizeMap[size] || sizeMap.md;

  const statusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700";

      case "Pending":
        return "bg-amber-100 text-amber-700";

      case "Cancelled":
        return "bg-rose-100 text-rose-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // ---------------- SUMMARY ----------------

  const totalBookings = bookings.length;

  const completedBookings = bookings.filter(
    (b) => b.status === "Completed"
  ).length;

  const pendingBookings = bookings.filter(
    (b) => b.status === "Pending"
  ).length;

  // ---------------- UI ----------------

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <h1 className="text-4xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by worker or service..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-search mb-4 w-full md:w-1/2"
      />

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`btn-icon-toggle ${
              statusFilter === status ? 'active' : 'inactive'
            }`}
          >
            {status}
          </button>
        ))}
      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        <div>

          <h1 className="text-4xl font-extrabold text-slate-900">
            My Bookings
          </h1>

          <p className="text-slate-600 mt-2">
            Track, manage and review all your service bookings
          </p>

        </div>

        <Link
          to="/services"
          className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-medium hover:bg-blue-700 transition w-fit"
        >
          + Book New Service
        </Link>

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">

          <p className="text-slate-500 text-sm">
            Total Bookings
          </p>

          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            {totalBookings}
          </h3>

        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">

          <p className="text-slate-500 text-sm">
            Pending Services
          </p>

          <h3 className="text-3xl font-bold text-amber-600 mt-2">
            {pendingBookings}
          </h3>

        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">

          <p className="text-slate-500 text-sm">
            Completed Services
          </p>

          <h3 className="text-3xl font-bold text-emerald-600 mt-2">
            {completedBookings}
          </h3>

        </div>

      </div>

      {/* SEARCH + FILTER */}

      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm mb-8">

        <div className="flex flex-col lg:flex-row gap-4">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search worker or service..."
            className="flex-1 px-5 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />

          <div className="flex flex-wrap gap-2">

            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  statusFilter === s
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}

          </div>

        </div>

      </div>

      {/* Empty State */}
      {!loading && filteredBookings.length === 0 && (
        <EmptyState
          icon="📭"
          title={
            search || statusFilter !== "All"
              ? "No bookings match your filters"
              : "No bookings yet"
          }
          description={
            search || statusFilter !== "All"
              ? "Try adjusting your search or resetting filters to see your bookings."
              : "Start by booking your first service and your bookings will appear here."
          }
          primaryAction={{ label: "Browse Services", to: "/services" }}
          secondaryAction={{
            label: "Reset filters",
            onClick: () => {
              setSearch("");
              setStatusFilter("All");
            },
          }}
        />
      {/* STATES */}

      {loading && (
        <div className="text-center py-16 text-slate-500">
          Loading bookings...
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 mb-6">
          {error}
        </div>
      )}

      {/* EMPTY */}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-3xl">

          <div className="text-6xl mb-4">
            📦
          </div>

          <h3 className="text-2xl font-bold text-slate-900">
            No bookings found
          </h3>

          <p className="text-slate-500 mt-2">
            Try adjusting filters or book a new service
          </p>

          <Link
            to="/services"
            className="btn-primary btn-primary-sm mt-4"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-blue-700 transition"
          >
            Browse Services
          </Link>

        </div>
      )}

      {/* BOOKING LIST */}

      <div className="space-y-6">

        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition duration-300"
          >

            {/* TOP */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div className="flex items-start gap-4">

                <img
                  src={b.workerImage}
                  alt={b.worker}
                  className="w-16 h-16 rounded-2xl object-cover"
                />

                <div>

                  <div className="flex items-center gap-2 flex-wrap">

                    <h3 className="text-xl font-bold text-slate-900">
                      {b.service}
                    </h3>

                    {b.verified && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}

                  </div>

                  <p className="text-slate-600 mt-1">
                    Worker: {b.worker}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">

                    <span>
                      📅 {b.date}
                    </span>

                    <span>
                      📍 {b.address}
                    </span>

                    <span>
                      💳 {b.payment}
                    </span>

                  </div>

                </div>

              </div>

              <div className="flex flex-col items-start lg:items-end gap-3">

                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusStyle(
                    b.status
                  )}`}
                >
                  {b.status}
                </span>

                <div className="text-right">

                  <p className="text-slate-500 text-sm">
                    Service Price
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900">
                    ${b.price}
                  </h3>

                </div>

              </div>

            </div>

            {/* OUTCOME SECTION */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

              <div className="bg-slate-50 rounded-2xl p-4">

                <p className="text-xs text-slate-500">
                  Arrival Time
                </p>

                <h4 className="font-bold text-slate-900 mt-1">
                  ⏱ {b.arrivalTime}
                </h4>

              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-4">
                {booking.status === "Pending" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={actionLoading[booking.id]}
                    className="btn-text-danger disabled:opacity-50 disabled:cursor-not-allowed"
                    className="text-red-600 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className={`btn-text ${actionLoading[booking.id] ? 'hidden' : ''}`}>Cancel</span>
                    <span className={`btn-loader ${actionLoading[booking.id] ? '' : 'hidden'}`}>Loading...</span>
              <div className="bg-slate-50 rounded-2xl p-4">

                <p className="text-xs text-slate-500">
                  Booking Type
                </p>

                <h4 className="font-bold mt-1 text-slate-900">
                  {b.instantBooking
                    ? "🚀 Instant Confirmation"
                    : "📝 Approval Required"}
                </h4>

              </div>

              <div className="bg-slate-50 rounded-2xl p-4">

                <p className="text-xs text-slate-500">
                  Booking ID
                </p>

                <h4 className="font-bold text-slate-900 mt-1">
                  #{b.id}
                </h4>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="mt-6 flex flex-wrap gap-3">

              {b.status === "Pending" && (
                <>
                  <button className="px-5 py-2.5 border border-slate-300 rounded-2xl font-medium hover:border-blue-500 hover:text-blue-600 transition">
                    Contact Worker
                  </button>

                  <button
                    onClick={() => setActiveReview(booking.id)}
                    className="btn-text"
                    onClick={() => handleCancel(b.id)}
                    className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-2xl font-medium hover:bg-rose-100 transition"
                  >
                    Cancel Booking
                  </button>
                </>
              )}

              {b.status === "Completed" && !b.review && (
                <button
                  onClick={() => setActiveReview(b.id)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition"
                >
                  Leave Review
                </button>
              )}

              {b.review && (
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl font-medium">
                  ⭐ {b.review.rating} Review Submitted
                </div>
              )}

            </div>

                  {/* Comment */}
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your feedback..."
                    className="textarea-base mb-3"
                    rows="3"
                  />

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReviewSubmit(booking.id)}
                      disabled={actionLoading[`review-${booking.id}`]}
                      className="btn-primary btn-primary-sm"
                    >
                      <span className={`btn-text ${actionLoading[`review-${booking.id}`] ? 'hidden' : ''}`}>Submit</span>
                      <span className={`btn-loader ${actionLoading[`review-${booking.id}`] ? '' : 'hidden'}`}>Loading...</span>
                    </button>
            {/* REVIEW BOX */}

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReviewSubmit(booking.id)}
                      disabled={actionLoading[`review-${booking.id}`]}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className={`btn-text ${actionLoading[`review-${booking.id}`] ? 'hidden' : ''}`}>Submit</span>
                      <span className={`btn-loader ${actionLoading[`review-${booking.id}`] ? '' : 'hidden'}`}>Loading...</span>
                    </button>
            {activeReview === b.id && (
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-3xl p-5">

                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Share Your Experience
                </h3>

                {/* STARS */}

                <div className="flex gap-2 mb-4">

                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      onClick={() => setActiveReview(null)}
                      className="btn-text"
                      key={s}
                      onClick={() => setRating(s)}
                      className={`text-3xl transition ${
                        rating >= s
                          ? "text-yellow-400 scale-110"
                          : "text-slate-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}

                </div>

                {/* COMMENT */}

                <textarea
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  placeholder="Write your feedback..."
                  className="w-full p-4 border border-slate-300 rounded-2xl text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* BUTTONS */}

                <div className="flex gap-3 mt-4">

                  <button
                    onClick={() =>
                      handleReviewSubmit(b.id)
                    }
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-medium hover:bg-blue-700 transition"
                  >
                    Submit Review
                  </button>

                  <button
                    onClick={() =>
                      setActiveReview(null)
                    }
                    className="px-5 py-2.5 border border-slate-300 rounded-2xl text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

          </div>
        ))}

      </div>

    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none transition-transform hover:scale-110"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRatingChange(star)}
        >
          <svg
            className={`${starSize} ${
              (hoverRating || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            } transition-colors`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default StarRating;