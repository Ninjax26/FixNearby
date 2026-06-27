import Booking from '../models/Booking.js';
import { STATUS_ENUM } from '../models/Booking.js';

/**
 * Authorization & validation helpers for the Booking resource.
 */

/**
 * Parses :id, validates it is an ObjectId, and loads the booking (404 when
 * missing). The loaded document is attached to `req.booking` so downstream
 * handlers and guards operate on a single source of truth.
 */
export const loadBooking = async (req, res, next) => {
  try {
    if (!req.params.id?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    req.booking = booking;
    next();
  } catch (error) {
    console.error('Error loading booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while loading booking'
    });
  }
};

/**
 * Resolves the authenticated principal on a request.
 */
export const getPrincipal = (req) => {
  const ref = req.worker || req.user;
  if (!ref) return null;

  const modelName = ref.constructor?.modelName;
  const model = modelName === 'Worker' ? 'Worker' : 'User';

  return {
    id: String(ref._id),
    model,
    ref
  };
};

/**
 * Allows the request only if the authenticated principal is the booking's
 * customer (User) or the assigned worker. Used by read & detail endpoints.
 */
export const requireBookingParticipant = (req, res, next) => {
  const principal = getPrincipal(req);
  if (!principal) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, authentication required'
    });
  }

  const isOwner = String(req.booking.userId) === principal.id;
  const isAssignedWorker = String(req.booking.workerId) === principal.id;

  if (!isOwner && !isAssignedWorker) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized: you can only access your own bookings'
    });
  }

  next();
};

/**
 * Guard that allows a status transition only for principals whose
 * role is permitted to perform it.
 */
export const authorizeStatusTransition = (req, res, next) => {
  const principal = getPrincipal(req);
  if (!principal) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, authentication required'
    });
  }

  const booking = req.booking;
  const from = booking.status;
  
  // Resolve 'to' state dynamically based on the endpoint path
  let to = req.body.status;
  if (!to) {
    if (req.baseUrl + req.path.endsWith('/accept')) to = 'Accepted';
    else if (req.baseUrl + req.path.endsWith('/complete')) to = 'Completed';
    else if (req.baseUrl + req.path.endsWith('/cancel')) to = 'Cancelled';
  }

  if (!to) {
    return res.status(400).json({
      success: false,
      message: 'No status transition target could be determined'
    });
  }

  // Matrix of (principalModel, from, to) -> allowed
  const allowed = {
    User: {
      Pending:     ['Cancelled'],
      Accepted:    ['Cancelled'],
      'In-Progress': [],
      Completed:   [],
      Cancelled:   [],
      Expired:     []
    },
    Worker: {
      Pending:     ['Accepted', 'Cancelled'],
      Accepted:    ['In-Progress', 'Cancelled'],
      'In-Progress': ['Completed'],
      Completed:   [],
      Cancelled:   [],
      Expired:     []
    }
  };

  const principalIsOwner = String(booking.userId) === principal.id;
  const principalIsWorker = String(booking.workerId) === principal.id;

  if (!principalIsOwner && !principalIsWorker) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized: you can only update your own bookings'
    });
  }

  if (principal.model === 'User' && !principalIsOwner) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized: you can only update your own bookings'
    });
  }
  if (principal.model === 'Worker' && !principalIsWorker) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized: you are not the assigned worker for this booking'
    });
  }

  const permittedTargets = allowed[principal.model][from] || [];
  if (!permittedTargets.includes(to)) {
    return res.status(409).json({
      success: false,
      message: `Invalid status transition: a ${principal.model.toLowerCase()} cannot move a ${from} booking to ${to}.`
    });
  }

  next();
};

export { STATUS_ENUM };
