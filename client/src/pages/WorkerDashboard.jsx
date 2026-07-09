import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaCheckCircle,
  FaClock,
  FaStar,
  FaMapMarkerAlt,
  FaArrowRight,
  FaBell,
  FaWrench,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import api from "../services/apiClient";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Jobs", value: "0" },
    { label: "Active Jobs", value: "0" },
    { label: "Completed", value: "0" },
    { label: "Rating", value: "5.0/5" },
  ]);

  useEffect(() => {
    const fetchWorkerDashboardData = async () => {
      try {
        const raw = localStorage.getItem("fixnearby_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          setWorker(parsed);
        }

        const savedAvailability = localStorage.getItem("workerAvailability");
        if (savedAvailability !== null) {
          setIsAvailable(savedAvailability === "true");
        }

        // Fetch dashboard stats from backend
        const statsResponse = await api.get("/workers/dashboard/stats");
        if (statsResponse.data?.success) {
          const { totalJobs, activeJobs, completedJobs, rating } = statsResponse.data;
          setStats([
            { label: "Total Jobs", value: totalJobs.toString() },
            { label: "Active Jobs", value: activeJobs.toString() },
            { label: "Completed", value: completedJobs.toString() },
            { label: "Rating", value: `${rating.toFixed(1)}/5` },
          ]);
        }

        // Fetch jobs from backend bookings
        const jobsResponse = await api.get("/bookings");
        const list = jobsResponse.data.bookings || jobsResponse.data.data || [];
        setJobs(list);
      } catch (err) {
        console.error("Failed to load worker dashboard stats", err);
      }
    };
    fetchWorkerDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("fixnearby_user");
    navigate("/worker/login");
  };

  const toggleAvailability = () => {
    const newStatus = !isAvailable;

    setIsAvailable(newStatus);

    localStorage.setItem(
        "workerAvailability",
        newStatus.toString()
    );
  };

  const statIcons = [
    { icon: <FaBriefcase />, color: "text-blue-600 bg-blue-50" },
    { icon: <FaClock />, color: "text-amber-600 bg-amber-50" },
    { icon: <FaCheckCircle />, color: "text-emerald-600 bg-emerald-50" },
    { icon: <FaStar />, color: "text-pink-600 bg-pink-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Worker Dashboard</h1>
            <p className="mt-1 text-slate-500">
              Welcome back{worker?.name ? `, ${worker.name}` : ""}! Manage your jobs and profile.
            </p>
          </div>
          <div className="flex gap-3">
            {worker?._id && (
              <Link
                to={`/worker/${worker._id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <FaUser /> View Profile
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-100">Worker Portal</p>
              <h2 className="mt-2 text-2xl font-bold">Ready for your next job? 🔧</h2>
              <p className="mt-2 max-w-xl text-blue-100">
                Track assigned jobs, update your availability, and manage your service history.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <FaBell className="text-yellow-300" />
                    <div>
                        <p className="text-xs text-blue-100">
                            Status
                        </p>

                        <p className="font-semibold">
                            {isAvailable
                            ? "Available for Jobs"
                            : "Offline"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={toggleAvailability}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                    isAvailable
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                >
                    {isAvailable ? "Online" : "Offline"}
                </button>
                </div>
              {worker?._id && (
                <Link
                  to={`/worker/${worker._id}`}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-slate-100"
                >
                  My Profile <FaArrowRight />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-5 xl:grid-cols-4">
          {stats.map((item, i) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <h3 className="mt-2 text-3xl font-bold text-slate-900">{item.value}</h3>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${statIcons[i].color}`}>
                  {statIcons[i].icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Job Activity */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Job Activity</h2>
                <p className="text-sm text-slate-500">Your assigned and recent jobs</p>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                <FaWrench className="mx-auto mb-3 text-3xl text-slate-300" />
                <p className="font-medium text-slate-700">No jobs assigned yet.</p>
                <p className="mt-1 text-sm text-slate-500">
                  Jobs booked by customers will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 rounded-xl border border-slate-100 p-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">{job.service || job.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                          <FaClock /> {job.date}
                        </span>
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt /> {job.location}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`self-start rounded-full px-3 py-1 text-xs font-semibold md:self-auto ${
                        job.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600"
                          : job.status === "In Progress"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
            <p className="text-sm text-slate-500">Access important actions instantly</p>

            <div className="mt-6 space-y-3">
              {worker?._id && (
                <Link
                  to={`/worker/${worker._id}`}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  View My Profile <FaArrowRight />
                </Link>
              )}
              {["Update Availability", "View Job History", "Contact Support"].map((action) => (
                <button
                  key={action}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  {action} <FaArrowRight />
                </button>
              ))}
            </div>

            {/* Worker Info Card */}
            {worker && (
              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {worker.name?.[0]?.toUpperCase() || "W"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{worker.name}</p>
                    <p className="text-xs text-slate-500">{worker.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;