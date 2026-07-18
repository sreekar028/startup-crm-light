import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express Error Handler.
 * Catches all errors from routing chain.
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // 1. Mongoose bad ObjectId CastError
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return errorResponse(res, message, 404);
  }

  // 2. MongoDB duplicate key (11000)
  if (err.code === 11000) {
    const message = 'Email already exists';
    return errorResponse(res, message, 409);
  }

  // 3. Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const fields = Object.keys(err.errors);
    const messages = fields.reduce((acc, field) => {
      acc[field] = err.errors[field].message;
      return acc;
    }, {});
    return errorResponse(res, 'Validation Error', 400, messages);
  }

  // 4. JWT JsonWebTokenError
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Token is invalid', 401);
  }

  // 5. JWT TokenExpiredError
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token has expired, please login again', 401);
  }

  // Default server error (500)
  const message = error.message || 'Server error';
  const responseData = process.env.NODE_ENV === 'development' ? { stack: error.stack } : null;
  return errorResponse(res, message, error.statusCode || 500, responseData);
};

export default errorHandler;
