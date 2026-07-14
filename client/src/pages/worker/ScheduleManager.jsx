import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  X,
  Repeat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getWorkerSchedule,
  setRecurringAvailability,
  blockTimeSlot,
  getBlockedSlots,
  removeBlockedSlot,
} from "../../services/scheduleService";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8am to 7pm

const getWeekDates = (baseDate) => {
  const d = new Date(baseDate);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });
};

const formatDate = (d) => d.toISOString().split("T")[0];
const formatDisplay = (d) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const ScheduleManager = () => {
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date();
    now.setDate(now.getDate() - now.getDay());
    return now;
  });
  const [schedule, setSchedule] = useState({});
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Block modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockForm, setBlockForm] = useState({
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    reason: "",
  });
  const [blockLoading, setBlockLoading] = useState(false);

  // Recurring form state
  const [recurringForm, setRecurringForm] = useState([]);
  const [recurringLoading, setRecurringLoading] = useState(false);

  const weekDates = getWeekDates(weekStart);
  const dateRange = {
    startDate: formatDate(weekDates[0]),
    endDate: formatDate(weekDates[6]),
  };

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [scheduleRes, blockedRes] = await Promise.all([
        getWorkerSchedule(dateRange),
        getBlockedSlots(dateRange),
      ]);
      setSchedule(scheduleRes.schedule || {});
      setBlockedSlots(blockedRes.blockedSlots || []);
      setRecurring(scheduleRes.recurringAvailability || []);
      setRecurringForm(scheduleRes.recurringAvailability || []);
    } catch (err) {
      console.warn("Schedule API unavailable:", err.message);
      // Build empty schedule
      const empty = {};
      for (const d of weekDates) {
        empty[formatDate(d)] = { date: formatDate(d), bookings: [], blocked: [], available: true };
      }
      setSchedule(empty);
      setError("API unavailable — showing empty schedule");
    } finally {
      setLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const openBlockModal = (dateStr) => {
    setBlockForm({ date: dateStr, startTime: "09:00", endTime: "17:00", reason: "" });
    setShowBlockModal(true);
  };

  const handleBlockSubmit = async (e) => {
    e.preventDefault();
    setBlockLoading(true);
    try {
      await blockTimeSlot(blockForm);
      setShowBlockModal(false);
      fetchSchedule();
    } catch (err) {
      alert(err.message || "Failed to block slot");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleRemoveBlock = async (id) => {
    try {
      await removeBlockedSlot(id);
      setBlockedSlots((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Remove block failed:", err);
    }
  };

  const toggleRecurringDay = (dayIdx) => {
    setRecurringForm((prev) => {
      const exists = prev.find((s) => s.dayOfWeek === dayIdx);
      if (exists) {
        return prev.filter((s) => s.dayOfWeek !== dayIdx);
      }
      return [...prev, { dayOfWeek: dayIdx, startTime: "09:00", endTime: "17:00" }];
    });
  };

  const updateRecurringTime = (dayIdx, field, value) => {
    setRecurringForm((prev) =>
      prev.map((s) => (s.dayOfWeek === dayIdx ? { ...s, [field]: value } : s))
    );
  };

  const saveRecurring = async () => {
    setRecurringLoading(true);
    try {
      await setRecurringAvailability(recurringForm);
      setRecurring(recurringForm);
    } catch (err) {
      alert(err.message || "Failed to save");
    } finally {
      setRecurringLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[40vh]">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-500 font-medium">Loading schedule...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-7 w-7 text-blue-600" />
          Schedule Manager
        </h1>
        <p className="text-sm text-gray-500 mt-1">Manage your availability and block time slots</p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevWeek} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {formatDisplay(weekDates[0])} — {formatDisplay(weekDates[6])}
        </h2>
        <button onClick={nextWeek} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekDates.map((d, i) => {
            const dateKey = formatDate(d);
            const dayData = schedule[dateKey] || {};
            const isToday = formatDate(new Date()) === dateKey;
            return (
              <div key={i} className={`p-3 text-center border-r border-gray-50 last:border-r-0 ${isToday ? "bg-blue-50" : ""}`}>
                <p className="text-xs font-medium text-gray-500 uppercase">{DAYS[i]}</p>
                <p className={`text-lg font-bold ${isToday ? "text-blue-600" : "text-gray-800"}`}>{d.getDate()}</p>
                {dayData.bookings?.length > 0 && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {dayData.bookings.length} booking{dayData.bookings.length > 1 ? "s" : ""}
                  </span>
                )}
                {dayData.blocked?.length > 0 && (
                  <span className="inline-block mt-1 ml-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                    {dayData.blocked.length} blocked
                  </span>
                )}
                <button
                  onClick={() => openBlockModal(dateKey)}
                  className="mt-2 w-full py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                >
                  <Plus className="h-3 w-3 inline mr-0.5" />
                  Block
                </button>
              </div>
            );
          })}
        </div>

        {/* Time slot visualization */}
        <div className="grid grid-cols-7 min-h-[200px]">
          {weekDates.map((d, i) => {
            const dateKey = formatDate(d);
            const dayData = schedule[dateKey] || {};
            return (
              <div key={i} className="border-r border-gray-50 last:border-r-0 p-2">
                {dayData.bookings?.map((b, bi) => (
                  <div key={bi} className="mb-1 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(b.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    <p className="truncate mt-0.5 font-medium">{b.service}</p>
                  </div>
                ))}
                {dayData.blocked?.map((bs, bi) => (
                  <div key={`b-${bi}`} className="mb-1 px-2 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    🚫 {bs.startTime} - {bs.endTime}
                  </div>
                ))}
                {(!dayData.bookings || dayData.bookings.length === 0) && (!dayData.blocked || dayData.blocked.length === 0) && (
                  <p className="text-xs text-gray-300 text-center mt-4">Free</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocked Slots List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-red-500" />
          Blocked Time Slots
        </h3>
        {blockedSlots.length === 0 ? (
          <p className="text-sm text-gray-400">No blocked time slots</p>
        ) : (
          <div className="space-y-2">
            {blockedSlots.map((slot) => (
              <div key={slot._id} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(slot.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}
                    {slot.startTime} — {slot.endTime}
                  </p>
                  {slot.reason && <p className="text-xs text-gray-500 mt-0.5">{slot.reason}</p>}
                </div>
                <button
                  onClick={() => handleRemoveBlock(slot._id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recurring Availability */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Repeat className="h-5 w-5 text-purple-600" />
          Recurring Weekly Availability
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {DAYS.map((day, i) => {
            const entry = recurringForm.find((s) => s.dayOfWeek === i);
            const isActive = !!entry;
            return (
              <div key={i} className={`border rounded-xl p-3 transition ${isActive ? "border-purple-300 bg-purple-50" : "border-gray-200"}`}>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleRecurringDay(i)}
                    className="h-4 w-4 text-purple-600 rounded"
                  />
                  <span className="font-medium text-sm text-gray-700">{day}</span>
                </label>
                {isActive && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="time"
                      value={entry.startTime}
                      onChange={(e) => updateRecurringTime(i, "startTime", e.target.value)}
                      className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5"
                    />
                    <span className="text-gray-400 text-xs">to</span>
                    <input
                      type="time"
                      value={entry.endTime}
                      onChange={(e) => updateRecurringTime(i, "endTime", e.target.value)}
                      className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={saveRecurring}
          disabled={recurringLoading}
          className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {recurringLoading ? "Saving..." : "Save Recurring Settings"}
        </button>
      </div>

      {/* Block Time Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Block Time Slot</h3>
              <button onClick={() => setShowBlockModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleBlockSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={blockForm.date}
                  onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={blockForm.startTime}
                    onChange={(e) => setBlockForm({ ...blockForm, startTime: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={blockForm.endTime}
                    onChange={(e) => setBlockForm({ ...blockForm, endTime: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                <input
                  type="text"
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  placeholder="e.g. Personal appointment"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={blockLoading}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {blockLoading ? "Blocking..." : "Block Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;
