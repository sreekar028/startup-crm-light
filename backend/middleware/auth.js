import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Authentication check middleware.
 * Verifies JWT signature and attaches User details to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'No token provided, access denied', 401);
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user associated with token
    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 'User belonging to this token no longer exists', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'User account is deactivated', 403);
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired, please login again', 401);
    }
    return errorResponse(res, 'Token is invalid', 401);
  }
};
