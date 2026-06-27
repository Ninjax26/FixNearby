/**
 * AuditLog.js
 *
 * Mongoose schema for recording security-relevant and data-modifying
 * operations in a persistent, append-only collection.
 *
 * ## Why audit logs?
 * When something goes wrong — a disputed booking, an unauthorized profile
 * change, an account takeover — the first question is always "what happened
 * and who did it?"  Without audit records, that question is unanswerable.
 *
 * ## Design decisions
 *
 * ### TTL index
 * Logs expire automatically after 90 days via a MongoDB TTL index on
 * `createdAt`.  This prevents unbounded collection growth while still
 * covering the typical investigation window.  Increase `expireAfterSeconds`
 * or remove the index entirely if compliance requires longer retention.
 *
 * ### Actor model
 * Both `actorId` and `actorType` are stored so a single log collection can
 * record actions by Users, Workers, and (in future) admin accounts without
 * requiring a polymorphic reference.
 *
 * ### Asynchronous writes
 * Audit log writes should be fire-and-forget (non-blocking).  The helper
 * function `writeAuditLog` exported below handles errors silently so a
 * logging failure never causes an HTTP request to fail.
 *
 * ## Usage
 *
 *   import { writeAuditLog } from '../models/AuditLog.js';
 *
 *   // Inside a controller, after a successful operation:
 *   writeAuditLog({
 *     actorId:   req.user._id,
 *     actorType: 'User',
 *     action:    'BOOKING_CREATED',
 *     resource:  'Issue',
 *     resourceId: newIssue._id,
 *     metadata:  { workerId: newIssue.workerId },
 *     ip:        req.ip,
 *     userAgent: req.get('user-agent'),
 *   });
 */

import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    /** The user or worker that performed the action. */
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    /** Discriminates between 'User', 'Worker', and future actor types. */
    actorType: {
      type: String,
      enum: ['User', 'Worker', 'System'],
      required: true,
    },

    /**
     * Semantic action name in SCREAMING_SNAKE_CASE.
     * Examples: LOGIN_SUCCESS, BOOKING_CREATED, PROFILE_UPDATED,
     *           WORKER_STATUS_CHANGED, PASSWORD_RESET_REQUESTED.
     */
    action: {
      type: String,
      required: true,
      index: true,
    },

    /** Collection or domain area affected, e.g. 'Issue', 'Worker', 'Auth'. */
    resource: {
      type: String,
      default: null,
    },

    /** The specific document ID that was affected, if applicable. */
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    /**
     * Free-form supplementary data.  Keep this small — large payloads should
     * be stored in a separate collection with a reference here.
     */
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /** Originating IP address for security investigations. */
    ip: {
      type: String,
      default: null,
    },

    /** User-Agent string for device fingerprinting. */
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    // Disable __v — audit logs are immutable; versioning adds no value.
    versionKey: false,

    // Use createdAt as the primary timestamp; updatedAt is unused (logs never
    // change after creation) but included for schema completeness.
    timestamps: true,
  }
);

// TTL index: MongoDB automatically removes documents 90 days after createdAt.
auditLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
);

// Compound index for the most common query: "show me all actions by actor X".
auditLogSchema.index({ actorId: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

/**
 * Fire-and-forget audit log writer.
 *
 * Errors are swallowed and printed to stderr so that a logging failure
 * never propagates to the caller or causes an HTTP 500.
 *
 * @param {object} entry - Fields matching the auditLogSchema above.
 */
export async function writeAuditLog(entry) {
  try {
    await AuditLog.create(entry);
  } catch (err) {
    console.error('[AuditLog] Failed to write log entry:', err.message);
  }
}

export default AuditLog;
