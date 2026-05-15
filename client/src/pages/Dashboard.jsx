const stats = [
  { label: "Total Bookings", value: "12" },
  { label: "Active Jobs", value: "2" },
  { label: "Completed", value: "10" },
  { label: "Rating", value: "4.8/5" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900">
            User Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your bookings, track progress, and review recent activity.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-slate-600">
            This is your personal activity panel. Upcoming bookings and service
            history will appear here.
          </p>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
            <p className="font-medium text-slate-700">No active bookings yet.</p>
            <p className="mt-1 text-sm text-slate-500">
              Book a service to start tracking updates from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
