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

    setActiveReview(null);
    setRating(0);
    setComment("");
  };

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
