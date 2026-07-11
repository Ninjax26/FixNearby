import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Wrench, ClipboardList, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import api from '../../services/apiClient';

const StatCard = ({ icon: Icon, label, value, color, link }) => (
  <Link to={link} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </Link>
);

const AdminDashboard = () => {
  useDocumentTitle('Admin Dashboard');
  const [stats, setStats] = useState({ users: 0, workers: 0, bookings: 0, issues: 0 });
  const [health, setHealth] = useState({ status: 'checking...', uptime: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, workersRes, bookingsRes, issuesRes] = await Promise.allSettled([
          api.get('/admin/stats'),
          api.get('/health'),
        ]);

        if (usersRes.status === 'fulfilled') setStats(usersRes.value.data?.stats || stats);
        if (workersRes.status === 'fulfilled') setHealth(workersRes.value.data || health);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={Users} label="Total Users" value={stats.users || 0} color="bg-blue-600" link="/admin/users" />
        <StatCard icon={Wrench} label="Total Workers" value={stats.workers || 0} color="bg-emerald-600" link="/admin/users" />
        <StatCard icon={ClipboardList} label="Bookings" value={stats.bookings || 0} color="bg-purple-600" link="/admin/users" />
        <StatCard icon={AlertTriangle} label="Open Issues" value={stats.issues || 0} color="bg-amber-600" link="/admin/users" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">System Health</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">API Status</span>
              <span className={`font-semibold ${loading ? 'text-gray-400' : health.status === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                {loading ? 'Checking...' : health.status === 'success' ? 'Operational' : 'Degraded'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Uptime</span>
              <span className="font-semibold text-gray-700">{Math.floor(health.uptime || 0)}s</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-emerald-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link to="/admin/users" className="block w-full text-center py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">Manage Users</Link>
            <Link to="/civic-issues" className="block w-full text-center py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">View Issues</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
