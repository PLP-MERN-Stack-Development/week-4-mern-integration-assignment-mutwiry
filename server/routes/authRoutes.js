import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getMe, 
  refreshToken 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', protect, getMe);

export default router;
