import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaClipboardList,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      label: "Total Bookings",
      value: "0",
      icon: <FaCalendarCheck />,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Active Jobs",
      value: "0",
      icon: <FaClipboardList />,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Completed",
      value: "0",
      icon: <FaCheckCircle />,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Rating",
      value: "5.0/5",
      icon: <FaStar />,
      color: "text-pink-600 bg-pink-50",
    },
  ]);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedBookings =
        JSON.parse(localStorage.getItem("bookings")) || [];

      setBookings(savedBookings);

      const total = savedBookings.length;

      const active = savedBookings.filter(
        (b) => b.status === "Pending" || b.status === "Confirmed"
      ).length;

      const completed = savedBookings.filter(
        (b) => b.status === "Completed"
      ).length;

      setStats([
        {
          label: "Total Bookings",
          value: total.toString(),
          icon: <FaCalendarCheck />,
          color: "text-indigo-600 bg-indigo-50",
        },
        {
          label: "Active Jobs",
          value: active.toString(),
          icon: <FaClipboardList />,
          color: "text-amber-600 bg-amber-50",
        },
        {
          label: "Completed",
          value: completed.toString(),
          icon: <FaCheckCircle />,
          color: "text-emerald-600 bg-emerald-50",
        },
        {
          label: "Rating",
          value: total > 0 ? "4.9/5" : "5.0/5",
          icon: <FaStar />,
          color: "text-pink-600 bg-pink-50",
        },
      ]);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              User Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Manage bookings, track progress, and review recent activity.
            </p>
          </div>

          <Link
            to="/services"
            className="rounded-xl bg-[#0056D2] px-5 py-3 text-white font-semibold hover:bg-[#0047AF] transition"
          >
            Book New Service
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  {loading ? (
                    <div className="mt-3 h-7 w-16 animate-pulse rounded-lg bg-slate-200" />
                  ) : (
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {item.value}
                    </h3>
                  )}
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${item.color}`}
                >
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Section */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Recent Bookings & Activity
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            This is your personal activity panel. Live bookings and service
            history are displayed below.
          </p>

          {loading ? (
            <div className="mt-8 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex animate-pulse items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-4 w-full">
                    <div className="h-12 w-12 rounded-xl bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-1/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <p className="font-medium text-slate-700">
                No active bookings yet.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Book a service to start tracking updates from your dashboard.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {bookings.slice(0, 5).map((booking, index) => (
                <div
                  key={booking.id || index}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-200 hover:border-blue-100 hover:bg-white hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-700">
                      🛠️
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900">
                        {booking.service}
                      </h4>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Worker: {booking.worker}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium text-slate-400">
                        <span>📅 {booking.date}</span>
                        <span>⏰ {booking.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:flex-col sm:items-end">
                    <span className="font-bold text-slate-900">
                      {booking.price}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        booking.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}

              {bookings.length > 5 && (
                <div className="pt-2 text-center">
                  <Link
                    to="/bookings"
                    className="text-sm font-semibold text-[#0056D2] hover:underline"
                  >
                    View all bookings ({bookings.length})
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;