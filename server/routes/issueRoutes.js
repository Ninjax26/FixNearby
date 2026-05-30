import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getNearbyIssues,
  createIssue,
  upvoteIssue,
  getIssueById,
  updateIssueStatus
} from '../controllers/issueController.js';

const router = express.Router();

// Setup multer storage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

// Allowed image extensions and MIME types for issue thumbnails.
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2,8)}${ext}`);
  }
});

// Reject uploads whose extension or MIME type is not in the allowlist.
// Checking both prevents bypasses where an attacker supplies a benign
// extension with a dangerous MIME type (or vice versa).
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed.'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
  },
});

// GET /nearby
router.get('/nearby', getNearbyIssues);

// POST / (create issue) - supports optional image
router.post('/', upload.single('image'), createIssue);

// POST /:id/upvote
router.post('/:id/upvote', upvoteIssue);

// GET /:id
router.get('/:id', getIssueById);

router.patch('/:id/status', updateIssueStatus);

export default router;
