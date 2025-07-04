import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/UserModel.js';

// Rate limiting configuration
const rateLimit = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests per 15 minutes

// Protect routes
export const protect = async (req, res, next) => {
    let token;
    let clientIp = req.ip || req.connection.remoteAddress;
    
    // Rate limiting check
    const now = Date.now();
    const clientData = rateLimit.get(clientIp) || { count: 0, firstRequest: now };
    
    // Reset the window if it's the first request or window has passed
    if (now - clientData.firstRequest > RATE_LIMIT_WINDOW_MS) {
        clientData.count = 0;
        clientData.firstRequest = now;
    }
    
    // Check if rate limit exceeded
    if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
        const retryAfter = Math.ceil((clientData.firstRequest + RATE_LIMIT_WINDOW_MS - now) / 1000);
        res.set('Retry-After', retryAfter);
        return next(
            new ErrorResponse(
                'Too many requests, please try again later.',
                429,
                {
                    retryAfter,
                    limit: MAX_REQUESTS_PER_WINDOW,
                    window: '15m'
                }
            )
        );
    }
    
    // Increment request count
    clientData.count++;
    rateLimit.set(clientIp, clientData);
    
    // Get token from header or cookie
    if (req.headers.authorization?.startsWith('Bearer')) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
        // Set token from cookie
        token = req.cookies.token;
    } else if (req.signedCookies?.token) {
        // Set token from signed cookie
        token = req.signedCookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(
            new ErrorResponse('Not authorized to access this route', 401, {
                code: 'NO_AUTH_TOKEN',
                docs: 'https://your-api-docs.com/errors/NO_AUTH_TOKEN'
            })
        );
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from the token
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return next(
                new ErrorResponse('User not found', 404, {
                    code: 'USER_NOT_FOUND',
                    userId: decoded.id
                })
            );
        }
        
        // Check if user is active
        if (!user.isActive) {
            return next(
                new ErrorResponse('User account is deactivated', 403, {
                    code: 'ACCOUNT_DEACTIVATED',
                    userId: user._id
                })
            );
        }
        
        // Attach user to request object
        req.user = user;
        
        // Add security headers
        res.set({
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'same-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        });
        
        next();
    } catch (error) {
        let message = 'Not authorized to access this route';
        let statusCode = 401;
        let errorData = { code: 'INVALID_TOKEN' };
        
        if (error.name === 'TokenExpiredError') {
            message = 'Session expired, please login again';
            statusCode = 401;
            errorData.code = 'TOKEN_EXPIRED';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Invalid token';
            errorData.code = 'INVALID_TOKEN_FORMAT';
        } else if (error.name === 'NotBeforeError') {
            message = 'Token not yet valid';
            errorData.code = 'TOKEN_NOT_YET_VALID';
        }
        
        return next(new ErrorResponse(message, statusCode, errorData));
    }
};

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                new ErrorResponse('User not authenticated', 401, {
                    code: 'NOT_AUTHENTICATED'
                })
            );
        }
        
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403,
                    {
                        code: 'UNAUTHORIZED_ROLE',
                        requiredRoles: roles,
                        userRole: req.user.role
                    }
                )
            );
        }
        
        next();
    };
};

// Check if user is the owner of the resource or an admin
export const isOwnerOrAdmin = (model, paramName = 'id') => {
    return async (req, res, next) => {
        try {
            const resource = await model.findById(req.params[paramName]);
            
            if (!resource) {
                return next(
                    new ErrorResponse('Resource not found', 404, {
                        code: 'RESOURCE_NOT_FOUND',
                        resource: model.modelName,
                        id: req.params[paramName]
                    })
                );
            }
            
            // Check if user is the owner or an admin
            const isOwner = resource.user && resource.user.toString() === req.user._id.toString();
            const isAdmin = req.user.role === 'admin';
            
            if (!isOwner && !isAdmin) {
                return next(
                    new ErrorResponse('Not authorized to access this resource', 403, {
                        code: 'NOT_RESOURCE_OWNER',
                        resource: model.modelName,
                        resourceId: resource._id,
                        userId: req.user._id
                    })
                );
            }
            
            // Attach resource to request for use in the route handler
            req.resource = resource;
            next();
        } catch (error) {
            next(error);
        }
    };
};
