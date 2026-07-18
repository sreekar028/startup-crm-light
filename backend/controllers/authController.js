import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper to generate JWT tokens.
 * 
 * @param {string} userId - User ID to sign
 * @returns {string} Signed token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Register User controller.
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'Email already exists', 409);
    }

    // 2. Create user document
    const user = await User.create({
      name,
      email,
      password,
    });

    // 3. Issue Token
    const token = generateToken(user._id);

    return successResponse(res, { token, user }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Login User controller.
 * POST /api/auth/login
 * Note: express-rate-limit should be mounted on this route in production to prevent brute force attacks.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 2. Verify account is active
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // 3. Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 4. Issue token
    const token = generateToken(user._id);

    // Remove password field manually from mongoose object (or rely on toJSON)
    const userObj = user.toJSON();

    return successResponse(res, { token, user: userObj }, 'Logged in successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Profile controller.
 * GET /api/auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    return successResponse(res, req.user, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update Profile controller.
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    // 1. Update name if provided
    if (name) {
      user.name = name;
    }

    // 2. Password update logic
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(res, 'Please provide your current password to update password', 400);
      }
      
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, 'Invalid current password', 401);
      }

      user.password = newPassword;
    }

    // 3. Save User (hashes password via pre-save hook)
    await user.save();

    const updatedUser = await User.findById(req.user._id);

    return successResponse(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};
