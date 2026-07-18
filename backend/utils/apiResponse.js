/**
 * Standard Success Response helper.
 * 
 * @param {Object} res - Express response object
 * @param {any} data - Data payload
 * @param {string} message - Message detail
 * @param {number} [statusCode=200] - HTTP status code
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standard Error Response helper.
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message detail
 * @param {number} [statusCode=500] - HTTP status code
 * @param {any} [errors=null] - Detailed validation or context errors
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Standard Paginated Response helper.
 * 
 * @param {Object} res - Express response object
 * @param {Array} data - Array data records
 * @param {number} total - Total records in database
 * @param {number} page - Current page index
 * @param {number} limit - Records limit per page
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit),
    },
  });
};
