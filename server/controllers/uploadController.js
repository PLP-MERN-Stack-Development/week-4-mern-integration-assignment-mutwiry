import asyncHandler from '../middleware/async.js';

// @desc    Upload a file
// @route   POST /api/upload
// @access  Private/Admin
const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const filePath = `/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    data: filePath,
  });
});

export { uploadFile };
