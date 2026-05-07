const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Dashboard</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Welcome back!</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">This is a placeholder dashboard. Contributors will add user-specific data here.</p>
        
        <div className="mt-6 border-t border-gray-200 pt-4">
          {/* TODO: Connect API here to fetch user data/bookings */}
          <div className="text-center py-10 bg-gray-50 rounded border border-dashed border-gray-300">
            <span className="text-slate-600 leading-relaxed">No active bookings yet.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
const Dashboard = () => {
  const stats = [
    { label: "Total Bookings", value: "12", color: "blue" },
    { label: "Active Jobs", value: "2", color: "emerald" },
    { label: "Completed", value: "10", color: "purple" },
    { label: "Rating", value: "4.8★", color: "yellow" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900">
            User Dashboard
          </h1>
          <p className="mt-2 text-slate-700">
            Manage your bookings, track progress, and view activity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-sm text-slate-500 font-medium">
                {item.label}
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition p-8">

          <h3 className="text-xl font-bold text-slate-900">
            Welcome back!
          </h3>

          <p className="mt-2 text-slate-600">
            This is your personal activity panel. You can track bookings and service history here.
          </p>

          {/* Empty state */}
          <div className="mt-8 flex flex-col items-center justify-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">

            <div className="text-4xl mb-3">📦</div>

            <p className="text-slate-600 font-medium">
              No active bookings yet
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Book a service to see updates here
            </p>

            <button className="mt-5 bg-[#0056D2] hover:bg-[#0047AF] text-white px-6 py-2.5 rounded-xl font-semibold transition">
              Browse Services
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: "Total Bookings", value: "12", color: "blue" },
    { label: "Active Jobs", value: "2", color: "emerald" },
    { label: "Completed", value: "10", color: "purple" },
    { label: "Rating", value: "4.8★", color: "yellow" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900">
            User Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your bookings, track progress, and view activity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-sm text-slate-500 font-medium">
                {item.label}
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition p-8">

          <h3 className="text-xl font-bold text-slate-900">
            Welcome back!
          </h3>

          <p className="mt-2 text-slate-600">
            This is your personal activity panel. You can track bookings and service history here.
          </p>

          {/* Empty state */}
          <div className="mt-8 flex flex-col items-center justify-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">

            <div className="text-4xl mb-3">📦</div>

            <p className="text-slate-600 font-medium">
              No active bookings yet
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Book a service to see updates here
            </p>

            <button className="mt-5 bg-[#0056D2] hover:bg-[#0047AF] text-white px-6 py-2.5 rounded-xl font-semibold transition">
              Browse Services
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
