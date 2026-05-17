import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import StarRating from "../components/StarRating";

const demoBookings = [
  {
    id: "BK-101",
    worker: "Jane Smith",
    service: "Plumbing",
    date: "2026-05-10",
    status: "Pending",
  },
  {
    id: "BK-102",
    worker: "John Doe",
    service: "Electrical",
    date: "2026-05-14",
    status: "Pending",
  },
  {
    id: "BK-103",
    worker: "Mike Johnson",
    service: "Carpentry",
    date: "2026-05-01",
    status: "Completed",
  },
];

const statusOptions = ["All", "Pending", "Completed", "Cancelled"];

const statusStyle = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-800";
    case "Pending":
      return "bg-amber-100 text-amber-800";
    case "Cancelled":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeReview, setActiveReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem("bookings");

      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      } else {
        setBookings(demoBookings);
        localStorage.setItem("bookings", JSON.stringify(demoBookings));
      }
    } catch (loadError) {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("bookings", JSON.stringify(bookings));
    }
  }, [bookings, loading]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        booking.worker.toLowerCase().includes(query) ||
        booking.service.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const handleCancel = (id) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id ? { ...booking, status: "Cancelled" } : booking
      )
    );
  };

  // ---------------- REVIEW ----------------
{/* REVIEW BOX */}

{activeReview === b.id && (
  <div className="mt-6 relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">

    {/* TOP GRADIENT */}
    <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
  const handleReviewSubmit = (id) => {
    if (!rating) {
      window.alert("Please select a rating before submitting.");
      return;
    }

    setBookings((current) =>
      current.map((booking) =>
        booking.id === id
          ? { ...booking, review: { rating, comment } }
          : booking
      )
    );

    <div className="p-6">

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4 mb-6">

        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Share Your Experience
          </h3>

          <p className="text-slate-500 mt-1 text-sm">
            Your feedback helps other customers choose better services.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-2xl text-sm font-medium">
          ⭐ Review
        </div>

      </div>

      {/* WORKER PREVIEW */}

      <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">

        <img
          src={b.workerImage}
          alt={b.worker}
          className="w-14 h-14 rounded-2xl object-cover"
        />

        <div>
          <h4 className="font-bold text-slate-900">
            {b.worker}
          </h4>

          <p className="text-sm text-slate-500">
            {b.service} Service
          </p>
        </div>

      </div>

      {/* STAR SECTION */}

      <div className="mb-6">

        <p className="text-sm font-medium text-slate-700 mb-3">
          Rate your experience
        </p>

        <div className="flex items-center gap-2 flex-wrap">

          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setRating(s)}
              className={`group transition-all duration-200 ${
                rating >= s
                  ? "scale-110"
                  : "hover:scale-110"
              }`}
            >
              <span
                className={`text-4xl transition-all duration-200 ${
                  rating >= s
                    ? "text-yellow-400 drop-shadow"
                    : "text-slate-300 group-hover:text-yellow-300"
                }`}
              >
                ★
              </span>
            </button>
          ))}

          {/* RATING TEXT */}

          <div className="ml-2">

            {rating === 1 && (
              <span className="text-rose-500 font-semibold">
                Poor
              </span>
            )}

            {rating === 2 && (
              <span className="text-orange-500 font-semibold">
                Fair
              </span>
            )}

            {rating === 3 && (
              <span className="text-amber-500 font-semibold">
                Good
              </span>
            )}

            {rating === 4 && (
              <span className="text-lime-600 font-semibold">
                Very Good
              </span>
            )}

            {rating === 5 && (
              <span className="text-emerald-600 font-semibold">
                Excellent
              </span>
            )}

          </div>

        </div>

      </div>

      {/* REVIEW TEXTAREA */}

      <div className="mb-6">

        <div className="flex items-center justify-between mb-2">

          <label className="text-sm font-medium text-slate-700">
            Write your feedback
          </label>

          <span className="text-xs text-slate-400">
            {comment.length}/300
          </span>

        </div>

        <textarea
          value={comment}
          maxLength={300}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about service quality, professionalism, punctuality, and overall experience..."
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-700 min-h-[140px] resize-none outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

      </div>

      {/* QUICK TAGS */}

      <div className="mb-6">

        <p className="text-sm font-medium text-slate-700 mb-3">
          Quick feedback
        </p>

        <div className="flex flex-wrap gap-2">

          {[
            "Professional",
            "On Time",
            "Friendly",
            "Affordable",
            "Highly Recommended",
            "Quick Service",
          ].map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setComment((prev) =>
                  prev.includes(tag)
                    ? prev
                    : `${prev} ${tag}`.trim()
                )
              }
              className="px-3 py-2 rounded-full border border-slate-200 bg-white text-sm text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition"
            >
              + {tag}
            </button>
          ))}

        </div>

      </div>

      {/* PREVIEW */}

      {(rating || comment) && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">

          <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
            Preview
          </p>

          <div className="flex items-center gap-1 text-yellow-400 text-lg mb-2">
            {"★".repeat(rating)}
          </div>

          <p className="text-slate-700 text-sm leading-relaxed">
            {comment || "Your review preview will appear here..."}
          </p>

        </div>
      )}

      {/* BUTTONS */}

      <div className="flex flex-col sm:flex-row gap-3">

        <button
          onClick={() => handleReviewSubmit(b.id)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-semibold hover:opacity-90 transition shadow-lg shadow-blue-100"
        >
          Submit Review
        </button>

        <button
          onClick={() => setActiveReview(null)}
          className="flex-1 sm:flex-none px-6 py-3 rounded-2xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
)}
    
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
  }, [bookings, search, statusFilter]);
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
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">

    {/* BACKGROUND BLUR EFFECTS */}

    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />

    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />

    {/* MAIN CONTAINER */}

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">


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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900">My Bookings</h1>
        <p className="mt-2 text-slate-600">
          Track, manage, and review your service bookings.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search worker or service..."
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 md:w-1/2"
        />

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                statusFilter === status
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {!loading && error && <p className="text-rose-600">{error}</p>}

      {!loading && !error && filteredBookings.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 py-16 text-center">
          <h3 className="text-xl font-bold text-slate-900">No bookings found</h3>
          <p className="mt-2 text-slate-600">
            Try adjusting your filters or book a new service.
          </p>
          <Link
            to="/services"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Browse Services
          </Link>
        </div>
      )}

      {!loading && !error && filteredBookings.length > 0 && (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {booking.service}
                  </h3>
                  <p className="text-slate-600">{booking.worker}</p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-slate-500">
                <span>ID: {booking.id}</span>
                <span>{booking.date}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                {booking.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => handleCancel(booking.id)}
                    className="font-medium text-rose-600 hover:text-rose-700"
                  >
                    Cancel
                  </button>
                )}

                {booking.status === "Completed" && !booking.review && (
                  <button
                    type="button"
                    onClick={() => setActiveReview(booking.id)}
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Leave Review
                  </button>
                )}

                {booking.review && (
                  <span className="font-medium text-emerald-600">
                    Rated {booking.review.rating}/5
                  </span>
                )}
              </div>

              {activeReview === booking.id && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 font-semibold text-slate-800">
                    Rate your experience
                  </p>

                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    size="md"
                  />

                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Write feedback..."
                    className="mt-3 w-full rounded-lg border border-slate-300 p-2 text-sm"
                  />

                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleReviewSubmit(booking.id)}
                      className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveReview(null);
                        setRating(0);
                        setComment("");
                      }}
                      className="text-sm text-slate-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
