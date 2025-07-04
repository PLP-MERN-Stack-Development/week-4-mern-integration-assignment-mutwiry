import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postController.js';

// Public routes
router.route('/').get(getPosts);
router.route('/:id').get(getPostById);

// Protected routes (require authentication)
router.route('/').post(protect, createPost);
router.route('/:id').put(protect, updatePost).delete(protect, deletePost);

export default router;
