import { useCallback, useEffect, useState } from "react";
import {
  getBookings,
  updateBookingStatus,
  rescheduleBooking as rescheduleBookingService,
} from "../services/bookingService";

/**
 * useBookings — fetches the authenticated principal's bookings from the API
 * and exposes loading/error state plus a cancel action.
 *
 * Replaces the previous localStorage-only flow where bookings existed solely
 * in the browser, so cancellations never reached the server and bookings were
 * lost on cache clear.
 *
 * @param {{ status?: string }} [initialParams]
 */
export const useBookings = (initialParams = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [params, setParams] = useState(initialParams);

  const fetchBookings = useCallback(async (fetchParams = params) => {
    setLoading(true);
    setError("");
    try {
      const data = await getBookings(fetchParams);
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchBookings();
  }, [params.status]);

  /**
   * Cancel a booking via the API with an optimistic local update that rolls
   * back on failure so the UI never lies about server state.
   */
  const cancelBooking = useCallback(async (id) => {
    const previous = bookings;
    setBookings((current) =>
      current.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b))
    );
    try {
      await updateBookingStatus(id, "Cancelled");
      return true;
    } catch (err) {
      setBookings(previous); // roll back optimistic update
      setError(err.message || "Failed to cancel booking");
      return false;
    }
  }, [bookings]);

  /**
   * Reschedule a booking via the API and update the local booking state.
   */
  const rescheduleBooking = useCallback(async (id, newTime) => {
    try {
      await rescheduleBookingService(id, newTime);
      setBookings((current) =>
        current.map((b) =>
          b._id === id ? { ...b, scheduledTime: newTime, scheduledDate: newTime } : b
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to reschedule booking");
      return { success: false, message: err.message };
    }
  }, []);

  return {
    bookings,
    loading,
    error,
    params,
    setParams,
    refresh: fetchBookings,
    cancelBooking,
    rescheduleBooking,
  };
};

export default useBookings;
