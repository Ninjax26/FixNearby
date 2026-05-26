import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import StarRating from "../components/StarRating";
const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);

const demoBookings = [
  {
    id: "BK-101",
    worker: "Jane Smith",
    service: "Plumbing",
    date: "2026-05-10",
    status: "Pending",
    price: 1200,
    workerImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  },
  {
    id: "BK-102",
    worker: "John Doe",
    service: "Electrical",
    date: "2026-05-14",
    status: "Pending",
    price: 1800,
    workerImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  },
  {
    id: "BK-103",
    worker: "Mike Johnson",
    service: "Carpentry",
    date: "2026-05-01",
    status: "Completed",
    price: 950,
    workerImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
  },
];


const addNotification = (message, type = "info") => {
  const newNotif = {
    id: Date.now(),
    message,
    type,
    read: false,
    time: new Date().toLocaleTimeString(),
  };

  setNotifications((prev) => [newNotif, ...prev]);
};
const statusOptions = ["All", "Pending", "Completed", "Cancelled"];

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


<div className="relative ml-4">
  <button
    onClick={() => setShowNotifications((p) => !p)}
    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
  >
    🔔
  </button>

  {notifications.filter(n => !n.read).length > 0 && (
    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-xs text-white flex items-center justify-center animate-bounce">
      {notifications.filter(n => !n.read).length}
    </span>
  )}

  {/* DROPDOWN */}
  {showNotifications && (
    <div className="absolute left-0 mt-3 w-80 rounded-2xl border bg-white shadow-xl z-50">
      <div className="p-4 border-b font-bold">
        Notifications
      </div>

      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">
            No notifications yet
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 border-b text-sm ${
                n.read ? "text-gray-400" : "text-gray-800"
              }`}
            >
              <div>{n.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                {n.time}
              </div>

              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((item) =>
                      item.id === n.id
                        ? { ...item, read: true }
                        : item
                    )
                  )
                }
                className="text-xs text-blue-600 mt-2"
              >
                Mark as read
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t flex justify-between text-xs">
        <button
          onClick={() =>
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, read: true }))
            )
          }
          className="text-blue-600"
        >
          Mark all read
        </button>

        <button
          onClick={() => setNotifications([])}
          className="text-rose-500"
        >
          Clear
        </button>
      </div>
    </div>
  )}
</div>
const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const [activeReview, setActiveReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // LOAD BOOKINGS
  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem("bookings");

      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      } else {
        setBookings(demoBookings);
        localStorage.setItem("bookings", JSON.stringify(demoBookings));
      }
    } catch (err) {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  // SAVE BOOKINGS
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("bookings", JSON.stringify(bookings));
    }
  }, [bookings, loading]);

  // FILTER + SORT
  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    let filtered = bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        booking.worker.toLowerCase().includes(query) ||
        booking.service.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.date) - new Date(a.date);

        case "oldest":
          return new Date(a.date) - new Date(b.date);

        case "status":
          return a.status.localeCompare(b.status);

        case "price":
          return (b.price || 0) - (a.price || 0);

        default:
          return 0;
      }
    });

    return filtered;
  }, [bookings, search, statusFilter, sortBy]);

  // CANCEL BOOKING
  const handleCancel = (id) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id
          ? { ...booking, status: "Cancelled" }
          : booking
      )
    );
    addNotification(`Booking ${id} was cancelled`, "error");
  };

  // SUBMIT REVIEW
  const handleReviewSubmit = (id) => {
    if (!rating) {
      alert("Please select a rating.");
      return;
    }

    setBookings((current) =>
      current.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              review: {
                rating,
                comment,
              },
            }
          : booking
      )
    );

    addNotification(`Review submitted for ${id}`, "success");
    setActiveReview(null);
    setRating(0);
    setComment("");
  };

  // SUMMARY
  const totalBookings = bookings.length;

  const completedBookings = bookings.filter(
    (b) => b.status === "Completed"
  ).length;

  const pendingBookings = bookings.filter(
    (b) => b.status === "Pending"
  ).length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative ml-4">
  <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
    🔔
  </button>

  {bookings.length > 0 && (
    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-xs text-white flex items-center justify-center animate-bounce">
      {bookings.filter(b => b.isNew || b.status === "Pending").length}
    </span>
  )}
</div> 
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              My Bookings
            </h1>

            <p className="mt-2 text-slate-600">
              Track, manage and review all your service bookings
            </p>
          </div>

          <Link
            to="/services"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-100 transition hover:scale-105"
          >
            <span className="relative z-10">
              + Book New Service
            </span>

            <div className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
          </Link>
        </div>

        {/* SUMMARY */}
        {/* SUMMARY */}
<div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

  {/* HEADER */}
  <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

    <div>
      <h2 className="text-xl font-bold text-slate-900">
        Booking Overview
      </h2>
      <p className="text-sm text-slate-500">
        Track your total, pending, and completed bookings
      </p>
    </div>

    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-600">
      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
      Live Data
    </div>

  </div>

  {/* STATS GRID */}
  <div className="grid gap-5 sm:grid-cols-3">

    {/* TOTAL */}
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100 blur-2xl opacity-60"></div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Total Bookings</p>
          <h2 className="mt-2 text-4xl font-black text-slate-900">
            {totalBookings}
          </h2>
        </div>

        <div className="rounded-2xl bg-blue-100 p-4 text-2xl">
          📦
        </div>
      </div>

    </div>

    {/* PENDING */}
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-amber-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-100 blur-2xl opacity-60"></div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Pending</p>
          <h2 className="mt-2 text-4xl font-black text-amber-600">
            {pendingBookings}
          </h2>
        </div>

        <div className="rounded-2xl bg-amber-100 p-4 text-2xl">
          ⏳
        </div>
      </div>

    </div>

    {/* COMPLETED */}
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-100 blur-2xl opacity-60"></div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Completed</p>
          <h2 className="mt-2 text-4xl font-black text-emerald-600">
            {completedBookings}
          </h2>
        </div>

        <div className="rounded-2xl bg-emerald-100 p-4 text-2xl">
          ✅
        </div>
      </div>

    </div>

  </div>
</div>

        {/* FILTERS */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}
            <div className="relative w-full lg:w-[380px]">

              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl" />

              {/* Input */}
              <div className="relative flex items-center overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition focus-within:border-blue-500 focus-within:shadow-lg focus-within:shadow-blue-100">

                {/* ICON */}
                <div className="pl-5 text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search workers or services..."
                  className="w-full bg-transparent px-4 py-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-rose-100 hover:text-rose-600"
                  >
                    ✕
                  </button>
                )}

              </div>
            </div>

            {/* FILTER RIGHT */}
            <div className="flex flex-wrap items-center gap-3">

              {/* STATUS FILTER */}
              <div className="flex flex-wrap gap-2">

                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                      statusFilter === status
                        ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}

              </div>

              {/* SORT */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="status">Status</option>
                <option value="price">Price</option>
              </select>

            </div>

          </div>

        </div>

        {/* LOADING */}
        {loading && <LoadingSpinner />}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-600">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white py-16 text-center shadow-sm">

            <div className="mb-4 text-6xl">
              📭
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              No bookings found
            </h3>

            <p className="mt-2 text-slate-600">
              Try adjusting your filters or book a new service.
            </p>

            <Link
              to="/services"
              className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-100 transition hover:opacity-90"
            >
              Browse Services
            </Link>

          </div>
        )}

        {/* BOOKINGS */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className="space-y-6">

            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >

                {/* TOP BAR */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                <div className="p-6">

                  {/* TOP */}
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex items-center gap-4">

                      <img
                        src={booking.workerImage}
                        alt={booking.worker}
                        className="h-16 w-16 rounded-2xl object-cover ring-4 ring-slate-100"
                      />

                      <div>

                        <h3 className="text-xl font-bold text-slate-900">
                          {booking.worker}
                        </h3>
                        {booking.isNew && (
  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
    New
  </span>
)}

                        <p className="text-slate-500">
                          {booking.service}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`w-fit rounded-full px-5 py-2 text-sm font-bold ${statusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                  </div>

                  

                    {/* DETAILS */}
<div className="mt-6 grid gap-4 sm:grid-cols-3">

  <div className="rounded-2xl bg-slate-50 p-5">

    <p className="text-xs uppercase tracking-wider text-slate-400">
      Booking ID
    </p>

    <p className="mt-2 font-bold text-slate-800">
      {booking.id}
    </p>

  </div>

  <div className="rounded-2xl bg-slate-50 p-5">

    <p className="text-xs uppercase tracking-wider text-slate-400">
      Date
    </p>

    <p className="mt-2 font-bold text-slate-800">
      {booking.date}
    </p>

  </div>

  <div className="rounded-2xl bg-slate-50 p-5">

    <p className="text-xs uppercase tracking-wider text-slate-400">
      Price
    </p>

    <p className="mt-2 font-bold text-slate-800">
      ₹{booking.price}
    </p>

  </div>

</div>

{/* BOOKING PROGRESS TRACKER */}
<div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-sm">

  {/* HEADER */}
  <div className="border-b border-slate-200 px-6 py-5">

    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xl text-white shadow-lg shadow-blue-200">
          📍
        </div>

        <div>

          <h3 className="text-xl font-black text-slate-900">
            Booking Progress
          </h3>

          <p className="text-sm text-slate-500">
            Real-time tracking for your booking
          </p>

        </div>

      </div>

      <div
        className={`rounded-full px-4 py-2 text-sm font-bold ${
          booking.status === "Completed"
            ? "bg-emerald-100 text-emerald-700"
            : booking.status === "Pending"
            ? "bg-amber-100 text-amber-700"
            : "bg-rose-100 text-rose-700"
        }`}
      >
        {booking.status}
      </div>

    </div>

  </div>

  {/* PROGRESS BODY */}
  <div className="p-6">

    {/* PROGRESS BAR */}
    <div className="mb-8">

      <div className="mb-3 flex items-center justify-between">

        <span className="text-sm font-semibold text-slate-700">
          Service Progress
        </span>

        <span className="text-sm font-bold text-slate-900">
          {booking.status === "Completed"
            ? "100%"
            : booking.status === "Pending"
            ? "65%"
            : "0%"}
        </span>

      </div>

      <div className="h-4 overflow-hidden rounded-full bg-slate-200">

        <div
          className={`h-full rounded-full transition-all duration-700 ${
            booking.status === "Completed"
              ? "w-full bg-gradient-to-r from-emerald-500 to-green-500"
              : booking.status === "Pending"
              ? "w-2/3 bg-gradient-to-r from-amber-400 to-orange-500"
              : "w-0"
          }`}
        />

      </div>

    </div>

    {/* STEPS */}
    <div className="grid gap-5 md:grid-cols-3">

      {/* STEP 1 */}
      <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-xl text-white shadow-lg shadow-emerald-200">
          ✓
        </div>

        <h4 className="text-lg font-bold text-slate-900">
          Booking Confirmed
        </h4>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Your booking request has been submitted successfully.
        </p>

        <div className="mt-4 rounded-full bg-emerald-100 px-4 py-2 text-center text-xs font-bold text-emerald-700">
          Completed
        </div>

      </div>

      {/* STEP 2 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white shadow-lg ${
            booking.status === "Cancelled"
              ? "bg-slate-300"
              : booking.status === "Completed"
              ? "bg-emerald-500"
              : "bg-amber-500 animate-pulse"
          }`}
        >
          👨‍🔧
        </div>

        <h4 className="text-lg font-bold text-slate-900">
          Worker Assigned
        </h4>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {booking.status === "Cancelled"
            ? "Assignment process stopped."
            : `${booking.worker} accepted your service request.`}
        </p>

        <div
          className={`mt-4 rounded-full px-4 py-2 text-center text-xs font-bold ${
            booking.status === "Cancelled"
              ? "bg-slate-100 text-slate-500"
              : booking.status === "Completed"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {booking.status === "Cancelled"
            ? "Unavailable"
            : booking.status === "Completed"
            ? "Completed"
            : "In Progress"}
        </div>

      </div>

      {/* STEP 3 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white shadow-lg ${
            booking.status === "Completed"
              ? "bg-emerald-500"
              : booking.status === "Cancelled"
              ? "bg-rose-500"
              : "bg-slate-300"
          }`}
        >
          {booking.status === "Completed"
            ? "🏁"
            : booking.status === "Cancelled"
            ? "✕"
            : "⌛"}
        </div>

        <h4 className="text-lg font-bold text-slate-900">
          Service Completion
        </h4>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {booking.status === "Completed"
            ? "Service completed successfully."
            : booking.status === "Cancelled"
            ? "Booking cancelled."
            : "Waiting for service completion."}
        </p>

        <div
          className={`mt-4 rounded-full px-4 py-2 text-center text-xs font-bold ${
            booking.status === "Completed"
              ? "bg-emerald-100 text-emerald-700"
              : booking.status === "Cancelled"
              ? "bg-rose-100 text-rose-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {booking.status}
        </div>

      </div>

    </div>

  </div>

</div>


                      {/* DETAILS */}
<div className="mt-6 grid gap-4 sm:grid-cols-3">

  <div className="rounded-2xl bg-slate-50 p-5 transition hover:bg-blue-50">

    <p className="text-xs uppercase tracking-wider text-slate-400">
      Booking ID
    </p>

    <p className="mt-2 font-bold text-slate-800">
      {booking.id}
    </p>

  </div>

  <div className="rounded-2xl bg-slate-50 p-5 transition hover:bg-indigo-50">

    <p className="text-xs uppercase tracking-wider text-slate-400">
      Date
    </p>

    <p className="mt-2 font-bold text-slate-800">
      {booking.date}
    </p>

  </div>

  <div className="rounded-2xl bg-slate-50 p-5 transition hover:bg-emerald-50">

    <p className="text-xs uppercase tracking-wider text-slate-400">
      Price
    </p>

    <p className="mt-2 text-2xl font-black text-slate-900">
      ₹{booking.price}
    </p>

  </div>

</div>



{/* BOOKING TIMELINE */}
<div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-sm">

  {/* HEADER */}
  <div className="relative overflow-hidden border-b border-slate-200 px-6 py-5">

    <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-200/30 blur-3xl" />

    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xl text-white shadow-lg shadow-blue-200">
          🚚
        </div>

        <div>

          <h3 className="text-xl font-black tracking-tight text-slate-900">
            Booking Timeline
          </h3>

          <p className="text-sm text-slate-500">
            Real-time service tracking
          </p>

        </div>

      </div>

      <div
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold ${
          booking.status === "Completed"
            ? "bg-emerald-100 text-emerald-700"
            : booking.status === "Pending"
            ? "bg-amber-100 text-amber-700"
            : "bg-rose-100 text-rose-700"
        }`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            booking.status === "Completed"
              ? "bg-emerald-500"
              : booking.status === "Pending"
              ? "bg-amber-500 animate-pulse"
              : "bg-rose-500"
          }`}
        />

        {booking.status}
      </div>

    </div>

  </div>

  {/* BODY */}
  <div className="relative px-6 py-8">

    {/* LINE */}
    <div className="absolute left-[27px] top-10 h-[calc(100%-5rem)] w-1 rounded-full bg-gradient-to-b from-blue-200 via-slate-200 to-slate-200" />

    {/* STEP 1 */}
    <div className="relative mb-10 flex gap-5">

      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-lg text-white shadow-lg shadow-emerald-200">
        ✓
      </div>

      <div className="flex-1 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div>

            <h4 className="text-lg font-bold text-slate-900">
              Booking Confirmed
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Your booking request was received successfully.
            </p>

          </div>

          <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
            Completed
          </span>

        </div>

        <div className="mt-4 flex flex-wrap gap-3">

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            📅 {booking.date}
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            🆔 {booking.id}
          </div>

        </div>

      </div>

    </div>

    {/* STEP 2 */}
    <div className="relative mb-10 flex gap-5">

      <div
        className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg text-white shadow-lg ${
          booking.status === "Cancelled"
            ? "bg-slate-300 shadow-slate-200"
            : booking.status === "Completed"
            ? "bg-emerald-500 shadow-emerald-200"
            : "bg-amber-500 shadow-amber-200 animate-pulse"
        }`}
      >
        👨‍🔧
      </div>

      <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div>

            <h4 className="text-lg font-bold text-slate-900">
              Worker Assigned
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              {booking.status === "Cancelled"
                ? "Assignment process stopped."
                : `${booking.worker} accepted your request.`}
            </p>

          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              booking.status === "Cancelled"
                ? "bg-slate-100 text-slate-500"
                : booking.status === "Completed"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {booking.status === "Cancelled"
              ? "Unavailable"
              : booking.status === "Completed"
              ? "Completed"
              : "In Progress"}
          </span>

        </div>

        {booking.status !== "Cancelled" && (
          <div className="mt-5 flex items-center gap-4 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4">

            <img
              src={booking.workerImage}
              alt={booking.worker}
              className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white"
            />

            <div className="flex-1">

              <h5 className="text-lg font-bold text-slate-900">
                {booking.worker}
              </h5>

              <p className="text-sm text-slate-500">
                {booking.service} Specialist
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Verified Worker
                </span>

                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  Fast Response
                </span>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>

    {/* STEP 3 */}
    <div className="relative flex gap-5">

      <div
        className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg text-white shadow-lg ${
          booking.status === "Completed"
            ? "bg-emerald-500 shadow-emerald-200"
            : booking.status === "Cancelled"
            ? "bg-rose-500 shadow-rose-200"
            : "bg-slate-300 shadow-slate-200"
        }`}
      >
        {booking.status === "Completed"
          ? "🏁"
          : booking.status === "Cancelled"
          ? "✕"
          : "⌛"}
      </div>

      <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div>

            <h4 className="text-lg font-bold text-slate-900">
              Service Completion
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              {booking.status === "Completed"
                ? "Service completed successfully."
                : booking.status === "Cancelled"
                ? "Booking cancelled by user."
                : "Waiting for worker completion update."}
            </p>

          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              booking.status === "Completed"
                ? "bg-emerald-100 text-emerald-700"
                : booking.status === "Cancelled"
                ? "bg-rose-100 text-rose-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {booking.status}
          </span>

        </div>

        {/* PROGRESS */}
        <div className="mt-5">

          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">

            <span>Progress</span>

            <span>
              {booking.status === "Completed"
                ? "100%"
                : booking.status === "Pending"
                ? "65%"
                : "0%"}
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">

            <div
              className={`h-full rounded-full transition-all duration-700 ${
                booking.status === "Completed"
                  ? "w-full bg-gradient-to-r from-emerald-500 to-green-500"
                  : booking.status === "Pending"
                  ? "w-2/3 bg-gradient-to-r from-amber-400 to-orange-500"
                  : "w-0"
              }`}
            />

          </div>

        </div>

      </div>

    </div>

  </div>

</div>
                  {/* ACTIONS */}
                 {/* QUICK ACTIONS */}
<div className="mt-6 flex flex-wrap items-center gap-3">

  <button
    type="button"
    className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
  >
    <span className="transition group-hover:scale-110">
      📞
    </span>
    Contact
  </button>

  <button
    type="button"
    className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600"
  >
    <span className="transition group-hover:scale-110">
      💬
    </span>
    Chat
  </button>

  <button
    type="button"
    className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
  >
    <span className="transition group-hover:scale-110">
      📄
    </span>
    Invoice
  </button>

</div>

{/* ACTIONS */}
<div className="mt-4 flex flex-wrap gap-3">

                    {booking.status === "Pending" && (
                      <button
                        type="button"
                        onClick={() => handleCancel(booking.id)}
                        className="rounded-2xl bg-rose-50 px-5 py-3 font-semibold text-rose-600 transition hover:bg-rose-100"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {booking.status === "Completed" &&
                      !booking.review && (
                        <button
                          type="button"
                          onClick={() => setActiveReview(booking.id)}
                          className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-100 transition hover:opacity-90"
                        >
                          Leave Review
                        </button>
                      )}

                    {booking.review && (
                      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3">

                        <StarRating
                          rating={booking.review.rating}
                          size="sm"
                        />

                        <span className="font-semibold text-emerald-700">
                          Reviewed
                        </span>

                      </div>
                    )}

                  </div>

                  {/* REVIEW BOX */}
                  {activeReview === booking.id && (
                    <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">

                      <div className="mb-6 flex items-start justify-between gap-4">

                        <div>

                          <h3 className="text-2xl font-bold text-slate-900">
                            Share Your Experience
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Your feedback helps others.
                          </p>

                        </div>

                        <div className="rounded-2xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                          ⭐ Review
                        </div>

                      </div>

                      {/* STAR */}
                      <div className="mb-6">

                        <p className="mb-3 text-sm font-semibold text-slate-700">
                          Rate your experience
                        </p>

                        <StarRating
                          rating={rating}
                          onRatingChange={setRating}
                          size="lg"
                        />

                      </div>

                      {/* COMMENT */}
                      <div className="mb-6">

                        <div className="mb-2 flex items-center justify-between">

                          <label className="text-sm font-semibold text-slate-700">
                            Write feedback
                          </label>

                          <span className="text-xs text-slate-400">
                            {comment.length}/300
                          </span>

                        </div>

                        <textarea
                          value={comment}
                          maxLength={300}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Tell us about your experience..."
                          className="min-h-[140px] w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                      </div>

                      {/* QUICK TAGS */}
                      <div className="mb-6">

                        <p className="mb-3 text-sm font-semibold text-slate-700">
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
                              type="button"
                              onClick={() =>
                                setComment((prev) =>
                                  prev.includes(tag)
                                    ? prev
                                    : `${prev} ${tag}`.trim()
                                )
                              }
                              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                            >
                              + {tag}
                            </button>
                          ))}

                        </div>

                      </div>

                      {/* PREVIEW */}
                      {(rating || comment) && (
                        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">

                          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
                            Preview
                          </p>

                          <div className="mb-2 flex items-center gap-1 text-lg text-yellow-400">
                            {"★".repeat(rating)}
                          </div>

                          <p className="text-sm leading-relaxed text-slate-700">
                            {comment ||
                              "Your review preview will appear here..."}
                          </p>

                        </div>
                      )}

                      {/* BUTTONS */}
                      <div className="flex flex-col gap-3 sm:flex-row">

                        <button
                          type="button"
                          onClick={() =>
                            handleReviewSubmit(booking.id)
                          }
                          className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg shadow-blue-100 transition hover:opacity-90"
                        >
                          Submit Review
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveReview(null);
                            setRating(0);
                            setComment("");
                          }}
                          className="flex-1 rounded-2xl border border-slate-300 px-6 py-3 text-slate-600 transition hover:bg-slate-100 sm:flex-none"
                        >
                          Cancel
                        </button>

                      </div>

                    </div>
                  )}

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Bookings;