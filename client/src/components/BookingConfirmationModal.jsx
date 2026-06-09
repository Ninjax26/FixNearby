import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, DollarSign, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import FocusTrap from "./FocusTrap";

const BookingConfirmationModal = ({ isOpen, onClose, bookingDetails }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!isOpen) return null;

  const specs = bookingDetails?.estimateSpecs;
  const matPct = specs
    ? Math.round((specs.materialCost / specs.totalCost) * 100)
    : 0;
  const labPct = 100 - matPct;

  return (
    <FocusTrap isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500" />

          <div className="p-6">
            {/* Success Icon */}
            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
              Booking Confirmed! 🎉
            </h2>

            {/* Smart Estimate Locked badge */}
            {specs && (
              <div className="flex items-center justify-center gap-2 mt-2 mb-4">
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 shadow-sm">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">
                    Smart Estimate Locked In
                  </span>
                </div>
              </div>
            )}

            {/* Core booking details */}
            <div className="border-t border-b py-4 mb-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Service:</span>
                <span className="font-semibold">{bookingDetails?.service || "Service Name"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Worker:</span>
                <span className="font-semibold">{bookingDetails?.worker || "Worker Name"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-semibold">{bookingDetails?.date || new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-semibold">{bookingDetails?.time || "10:00 AM"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Price:</span>
                <span className="font-bold text-emerald-600 text-lg">{bookingDetails?.price || "$XX/hr"}</span>
              </div>
            </div>

            {/* ── Estimate Specs (only if booked via estimator) ── */}
            {specs && (
              <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 overflow-hidden">

                {/* Collapsible header */}
                <button
                  id="toggle-estimate-breakdown"
                  onClick={() => setShowBreakdown((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <Package size={15} className="text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-800">Estimate Specs</span>
                    <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Approved
                    </span>
                  </div>
                  {showBreakdown
                    ? <ChevronUp size={16} className="text-emerald-600" />
                    : <ChevronDown size={16} className="text-emerald-600" />
                  }
                </button>

                {/* Summary pill always visible */}
                <div className="px-4 pb-3">
                  <code className="text-xs text-emerald-800 font-mono bg-emerald-100 px-2.5 py-1 rounded-lg">
                    {specs.summary}
                  </code>
                </div>

                {/* Cost split bar always visible */}
                <div className="px-4 pb-3">
                  <div className="flex justify-between text-xs text-emerald-600 mb-1">
                    <span>Materials {matPct}%</span>
                    <span>Labor {labPct}%</span>
                  </div>
                  <div className="cost-bar-track flex">
                    <div className="cost-bar-fill bg-blue-400" style={{ width: `${matPct}%` }} />
                    <div className="cost-bar-fill bg-amber-400" style={{ width: `${labPct}%` }} />
                  </div>
                </div>

                {/* Full breakdown (collapsible) */}
                {showBreakdown && (
                  <div className="border-t border-emerald-100 px-4 py-3 space-y-2">

                    {/* Material rows */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <Package size={12} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Materials</span>
                    </div>
                    {specs.materials.map((mat, i) => (
                      <div key={i} className="flex justify-between text-xs text-slate-700">
                        <span>
                          {mat.name}
                          <span className="text-slate-400 ml-1">({mat.qty} {mat.unit})</span>
                        </span>
                        <span className="font-semibold">${mat.subtotal.toFixed(2)}</span>
                      </div>
                    ))}

                    {/* Labor row */}
                    <div className="flex items-center gap-1.5 mt-3 mb-1">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Labor</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-700">
                      <span>
                        Labor
                        <span className="text-slate-400 ml-1">({specs.laborHours} hrs)</span>
                      </span>
                      <span className="font-semibold">${specs.laborCost.toFixed(2)}</span>
                    </div>

                    {/* Total line */}
                    <div className="border-t border-emerald-200 mt-3 pt-2 flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <DollarSign size={13} className="text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800">Total Estimate</span>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-600">
                        ${specs.totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <Link
                to="/bookings"
                className="flex-1 bg-blue-600 text-white text-center py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold"
                onClick={onClose}
              >
                View Bookings
              </Link>
              <Link
                to="/"
                className="flex-1 bg-gray-100 text-gray-700 text-center py-2.5 rounded-xl hover:bg-gray-200 transition font-semibold"
                onClick={onClose}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

export default BookingConfirmationModal;