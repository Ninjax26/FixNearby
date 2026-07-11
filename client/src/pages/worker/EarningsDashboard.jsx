import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  getEarningsDashboard,
  getEarningsHistory,
  requestPayout,
} from "../../services/earningService";

const MOCK_STATS = {
  totalEarnings: 48750,
  pendingAmount: 6200,
  paidAmount: 42550,
  thisMonth: 12400,
  bookingCount: 34,
};

const MOCK_EARNINGS = [
  { _id: "1", amount: 1500, platformFee: 150, netAmount: 1350, status: "paid", createdAt: "2026-07-10T10:30:00Z", description: "Plumbing repair - Sector 15", payoutDate: "2026-07-10" },
  { _id: "2", amount: 2200, platformFee: 220, netAmount: 1980, status: "pending", createdAt: "2026-07-09T14:00:00Z", description: "Electrical wiring - MG Road", payoutDate: null },
  { _id: "3", amount: 800, platformFee: 80, netAmount: 720, status: "paid", createdAt: "2026-07-08T09:15:00Z", description: "AC servicing - DLF Phase 2", payoutDate: "2026-07-08" },
  { _id: "4", amount: 3500, platformFee: 350, netAmount: 3150, status: "paid", createdAt: "2026-07-06T11:45:00Z", description: "Kitchen renovation - Sector 22", payoutDate: "2026-07-07" },
  { _id: "5", amount: 1100, platformFee: 110, netAmount: 990, status: "refunded", createdAt: "2026-07-05T16:20:00Z", description: "Carpentry work - Palam Vihar", payoutDate: null },
];

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          ₹{typeof value === "number" ? value.toLocaleString("en-IN") : value}
        </p>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);

const statusBadge = (status) => {
  const styles = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    refunded: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const EarningsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutMsg, setPayoutMsg] = useState(null);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, historyRes] = await Promise.all([
        getEarningsDashboard(),
        getEarningsHistory({ page, limit: 8 }),
      ]);
      setStats(statsRes);
      setEarnings(historyRes.earnings || []);
      setPagination(historyRes.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.warn("API unavailable, using mock data:", err.message);
      setStats(MOCK_STATS);
      setEarnings(MOCK_EARNINGS);
      setPagination({ page: 1, pages: 1, total: MOCK_EARNINGS.length });
      setError("Showing demo data — API unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePayout = async () => {
    if (!stats || stats.pendingAmount <= 0) return;
    setPayoutLoading(true);
    setPayoutMsg(null);
    try {
      await requestPayout(stats.pendingAmount);
      setPayoutMsg({ type: "success", text: "Payout request submitted!" });
      fetchData();
    } catch (err) {
      setPayoutMsg({ type: "error", text: err.message || "Payout request failed" });
    } finally {
      setPayoutLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchData(newPage);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[40vh]">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-500 font-medium">Loading earnings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Track your earnings, payouts, and financial history</p>
        </div>
        <button
          onClick={() => fetchData(pagination.page)}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          title="Refresh"
        >
          <RefreshCw className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {payoutMsg && (
        <div className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
          payoutMsg.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {payoutMsg.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {payoutMsg.text}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Earnings" value={stats?.totalEarnings || 0} color="bg-blue-600" subtext="Lifetime earnings" />
        <StatCard icon={TrendingUp} label="This Month" value={stats?.thisMonth || 0} color="bg-emerald-600" subtext={`${stats?.bookingCount || 0} bookings`} />
        <StatCard icon={Clock} label="Pending" value={stats?.pendingAmount || 0} color="bg-amber-500" subtext="Awaiting payout" />
        <StatCard icon={CheckCircle2} label="Paid" value={stats?.paidAmount || 0} color="bg-purple-600" subtext="Successfully paid" />
      </div>

      {/* Payout Action */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Request Payout</h3>
          <p className="text-sm text-gray-500">
            Available for payout: ₹{(stats?.pendingAmount || 0).toLocaleString("en-IN")}
          </p>
        </div>
        <button
          onClick={handlePayout}
          disabled={payoutLoading || !stats?.pendingAmount}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ArrowUpRight className="h-4 w-4" />
          {payoutLoading ? "Processing..." : "Request Payout"}
        </button>
      </div>

      {/* Earnings History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Earnings History</h3>
        </div>

        {earnings.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No earnings recorded yet</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 bg-gray-50">
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Description</th>
                    <th className="px-5 py-3 font-medium text-right">Amount</th>
                    <th className="px-5 py-3 font-medium text-right">Platform Fee</th>
                    <th className="px-5 py-3 font-medium text-right">Net Amount</th>
                    <th className="px-5 py-3 font-medium text-center">Status</th>
                    <th className="px-5 py-3 font-medium">Payout Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {earnings.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-5 py-3.5 text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-gray-800 max-w-[200px] truncate">
                        {item.description || "Service earning"}
                      </td>
                      <td className="px-5 py-3.5 text-right text-gray-700">
                        ₹{item.amount?.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3.5 text-right text-gray-500">
                        ₹{item.platformFee?.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                        ₹{item.netAmount?.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {statusBadge(item.status)}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">
                        {item.payoutDate
                          ? new Date(item.payoutDate).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} entries)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EarningsDashboard;
