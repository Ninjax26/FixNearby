import path from 'path';

export const validateUploadedFile = (req, res, next) => {
  if (!req.file) return next();
  
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(req.file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({ success: false, message: 'Invalid file format. Only JPG, JPEG, PNG, WEBP allowed.' });
  }
  
  const maxSize = 5 * 1024 * 1024;
  if (req.file.size > maxSize) {
    return res.status(400).json({ success: false, message: 'File size exceeds maximum threshold of 5MB.' });
  }
  
  next();
};