import { useState, useEffect } from "react";
import {
  Lightbulb,
  Send,
  ThumbsUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import {
  createRequest,
  getMyRequests,
  upvoteRequest,
} from "../services/serviceRequestService";

const URGENCY_OPTIONS = [
  { value: "low", label: "Low", color: "text-slate-600" },
  { value: "medium", label: "Medium", color: "text-amber-600" },
  { value: "high", label: "High", color: "text-rose-600" },
];

const SCHEDULE_OPTIONS = ["ASAP", "This week", "Next week", "Flexible"];

const BUDGET_OPTIONS = ["Under $50", "$50-$100", "$100-$200", "$200+", "Not sure"];

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  reviewed: "bg-blue-100 text-blue-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  fulfilled: "bg-purple-100 text-purple-700",
};

const RequestService = () => {
  const [form, setForm] = useState({
    categoryName: "",
    description: "",
    urgency: "medium",
    location: "",
    preferredSchedule: "Flexible",
    budget: "Not sure",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [upvotingId, setUpvotingId] = useState(null);

  // Load user's previous requests
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyRequests({ limit: 20 });
        if (data.success) {
          setMyRequests(data.requests || []);
        }
      } catch {
        // Silently fail — the list is supplementary
      } finally {
        setLoadingRequests(false);
      }
    };
    load();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.categoryName.trim()) {
      errs.categoryName = "Category name is required";
    }
    if (!form.description.trim()) {
      errs.description = "Please describe what service you need";
    } else if (form.description.length > 2000) {
      errs.description = "Description must be 2000 characters or fewer";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await createRequest(form);
      if (data.success) {
        setSubmitted(true);
        // Prepend the new request to the list
        if (data.request) {
          setMyRequests((prev) => [data.request, ...prev]);
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to submit request";
      setErrors({ submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      categoryName: "",
      description: "",
      urgency: "medium",
      location: "",
      preferredSchedule: "Flexible",
      budget: "Not sure",
    });
    setErrors({});
    setSubmitted(false);
  };

  const handleUpvote = async (id) => {
    setUpvotingId(id);
    try {
      const data = await upvoteRequest(id);
      if (data.success && data.request) {
        setMyRequests((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, voteCount: data.request.voteCount } : r
          )
        );
      }
    } catch {
      // ignore — vote count is best-effort
    } finally {
      setUpvotingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0056D2]/5 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-6">
              <Lightbulb className="w-4 h-4" />
              Community-driven service discovery
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Don't See Your Service?
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              Request a new service category and let our team know what you need.
              Other users can upvote requests to help us prioritize.
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-4 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-[28px] border border-slate-200 p-8 shadow-sm">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold mb-4">
                    <Send className="w-4 h-4" />
                    New Request
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    What service do you need?
                  </h2>
                  <p className="mt-2 text-slate-500 text-sm">
                    Fill in the details below and we'll review your request.
                  </p>
                </div>

                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-500" />
                    <h3 className="text-xl font-bold text-slate-900">
                      Request Submitted!
                    </h3>
                    <p className="text-slate-500">
                      Thanks for helping us improve. We'll review your request
                      shortly.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0056D2] px-5 py-2.5 text-white font-semibold hover:bg-[#0047AF] transition mt-4"
                    >
                      <Plus className="w-4 h-4" />
                      Request Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Service Category *
                      </label>
                      <input
                        type="text"
                        name="categoryName"
                        value={form.categoryName}
                        onChange={handleChange}
                        placeholder="e.g. Pool Cleaning, Smart Home Setup"
                        className={`w-full rounded-xl border ${
                          errors.categoryName ? "border-rose-300" : "border-slate-300"
                        } bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition`}
                      />
                      {errors.categoryName && (
                        <p className="text-xs text-rose-500 mt-1">
                          {errors.categoryName}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-semibold text-slate-700">
                          Description *
                        </label>
                        <span className="text-xs text-slate-400">
                          {form.description.length}/2000
                        </span>
                      </div>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        maxLength={2000}
                        rows={4}
                        placeholder="Tell us about the service you're looking for, why you need it, and any specific requirements..."
                        className={`w-full rounded-xl border ${
                          errors.description ? "border-rose-300" : "border-slate-300"
                        } bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition resize-none`}
                      />
                      {errors.description && (
                        <p className="text-xs text-rose-500 mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Urgency */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Urgency
                      </label>
                      <div className="flex gap-3">
                        {URGENCY_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({ ...prev, urgency: opt.value }))
                            }
                            className={`flex-1 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                              form.urgency === opt.value
                                ? "border-[#0056D2] bg-blue-50 text-[#0056D2]"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Preferred Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="City or neighborhood (optional)"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0056D2] focus:ring-2 focus:ring-blue-100 transition"
                      />
                    </div>

                    {/* Preferred Schedule */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Schedule
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {SCHEDULE_OPTIONS.map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-medium cursor-pointer transition-all ${
                              form.preferredSchedule === opt
                                ? "border-[#0056D2] bg-blue-50 text-[#0056D2]"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="preferredSchedule"
                              value={opt}
                              checked={form.preferredSchedule === opt}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Expected Budget
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {BUDGET_OPTIONS.map((opt) => (
                          <label
                            key={opt}
                            className={`flex items-center justify-center rounded-xl border-2 px-3 py-2.5 text-sm font-medium cursor-pointer transition-all ${
                              form.budget === opt
                                ? "border-[#0056D2] bg-blue-50 text-[#0056D2]"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="budget"
                              value={opt}
                              checked={form.budget === opt}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    {errors.submit && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {errors.submit}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0056D2] to-[#0040A0] px-6 py-4 text-white font-bold text-lg shadow-lg shadow-blue-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right sidebar — previous requests */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4 text-slate-400" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Your Requests
                  </h3>
                </div>

                {loadingRequests ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-xl border border-slate-100 p-4 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                        <div className="h-3 bg-slate-100 rounded w-full" />
                      </div>
                    ))}
                  </div>
                ) : myRequests.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">
                    You haven't submitted any requests yet.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {myRequests.map((req) => (
                      <div
                        key={req._id}
                        className="rounded-xl border border-slate-100 p-4 space-y-2 hover:shadow-sm transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-800 leading-tight">
                            {req.categoryName}
                          </h4>
                          <span
                            className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              STATUS_STYLES[req.status] || "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {req.description}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpvote(req._id)}
                            disabled={upvotingId === req._id}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0056D2] disabled:opacity-50 transition"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            {req.voteCount || 0}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestService;
