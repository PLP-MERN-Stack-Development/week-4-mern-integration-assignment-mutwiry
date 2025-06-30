const express = require('express');
const {
  register,
  login,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

console.log('Auth routes module loaded');

// Basic auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Export the router
module.exports = router;