import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email);
  
  // Validate email & password
  if (!email || !password) {
    console.log('Missing email or password');
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    // Check for user
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('No user found with email:', email);
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if account is locked
    if (user.isLocked) {
      console.log('Account is locked for user:', email);
      return next(new ErrorResponse('Account is temporarily locked. Please try again later.', 423));
    }

    // Check if password matches
    console.log('Checking password...');
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      // Increment failed login attempts
      await user.incrementLoginAttempts();
      const attemptsLeft = 5 - (user.loginAttempts + 1);
      
      return next(new ErrorResponse(
        `Invalid credentials. ${attemptsLeft > 0 ? attemptsLeft + ' attempts left' : 'Account locked'}`,
        401,
        { attemptsLeft }
      ));
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      await user.resetLoginAttempts();
    }

    // Update last login time
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    console.log('Login successful, sending token...');
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    next(new ErrorResponse('Server error during login', 500));
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  try {
    console.log('Generating token for user:', user._id);
    
    // Validate user object
    if (!user || !user._id) {
      throw new Error('Invalid user object provided for token generation');
    }

    // Create token
    const token = user.getSignedJwtToken();
    
    if (!token) {
      console.error('Failed to generate token for user:', user._id);
      throw new Error('Failed to generate authentication token');
    }

    console.log('Token generated successfully');
    
    // Set cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 || 30 * 24 * 60 * 60 * 1000) // Default 30 days
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
    };

    console.log('Setting cookie with options:', {
      expires: cookieOptions.expires,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite
    });

    // Prepare response data
    const responseData = {
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        },
        token // Include token in response body for clients that prefer to handle it
      }
    };

    console.log('Sending token response');
    
    // Send response with cookie and JSON
    res
      .status(statusCode)
      .cookie('token', token, cookieOptions)
      .json(responseData);
      
  } catch (error) {
    console.error('Error in sendTokenResponse:', error);
    
    // Clear any partial response that might have been sent
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Authentication error',
        message: error.message || 'An error occurred during authentication',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      console.error('Headers already sent, could not send error response');
    }
  }
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
export const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    
    if (!token) {
      console.log('No refresh token found in cookies');
      return next(new ErrorResponse('No refresh token provided', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('User not found for refresh token');
      return next(new ErrorResponse('User not found', 401));
    }

    // Generate new token
    const newToken = user.getSignedJwtToken();
    
    // Set cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 || 30 * 24 * 60 * 60 * 1000)
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
    };

    // Send response with new token
    res
      .status(200)
      .cookie('token', newToken, cookieOptions)
      .json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'user'
          },
          token: newToken
        }
      });
      
  } catch (error) {
    console.error('Token refresh error:', error);
    next(new ErrorResponse('Invalid or expired refresh token', 401));
  }
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      console.warn('No user in request object');
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    const user = await User.findById(req.user.id)
      .select('-password -__v -resetPasswordToken -resetPasswordExpire');

    if (!user) {
      console.warn(`User not found with id: ${req.user.id}`);
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    next(new ErrorResponse('Server error', 500));
  }
});
