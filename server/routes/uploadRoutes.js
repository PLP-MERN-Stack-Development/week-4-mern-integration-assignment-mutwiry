import express from 'express';
import { upload, handleUploadErrors } from '../middleware/uploadMiddleware.js';
import { uploadFile } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload a file
// @access  Private
router.post(
  '/',
  protect,
  upload.single('image'),
  handleUploadErrors,
  uploadFile
);

export default router;
