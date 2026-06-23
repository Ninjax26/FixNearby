import Issue from '../models/Issue.js';
import mongoose from 'mongoose';
import { queueNotification } from '../utils/queue.js';

export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({}).populate('reportedBy', 'name email');
    res.status(200).json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createIssue = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, description, category, latitude, longitude } = req.body;
    
    // Concurrency Check: Verify no existing open issue is registered within close coordinates
    const duplicate = await Issue.findOne({
      category,
      status: 'open',
      latitude: { $gte: latitude - 0.0001, $lte: latitude + 0.0001 },
      longitude: { $gte: longitude - 0.0001, $lte: longitude + 0.0001 }
    }).session(session);

    if (duplicate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        message: 'A similar issue in this location has already been reported and is currently open.'
      });
    }

    const newIssue = new Issue({
      title,
      description,
      category,
      latitude,
      longitude,
      reportedBy: req.user ? req.user._id : undefined
    });

    await newIssue.save({ session });
    await session.commitTransaction();
    session.endSession();

    // Queue civic report notification
    await queueNotification('civic_report_created', { issueId: newIssue._id });

    res.status(201).json({ success: true, data: newIssue });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const oldStatus = issue.status;
    issue.status = status;
    if (status === 'resolved') {
      issue.resolvedAt = new Date();
    }
    issue.statusHistory.push({ status, note, updatedAt: new Date() });
    await issue.save();

    // Queue status update notification
    await queueNotification('issue_status_update', {
      issueId: issue._id,
      oldStatus,
      newStatus: status
    });

    res.status(200).json({ success: true, data: issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
