import { validationResult } from 'express-validator';

/**
 * Validation runner middleware.
 * Executes express-validator checks and returns 400 formatted list on failures.
 * 
 * @param {Array} validations - express-validator rules chain
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validation chains
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  };
};

export default validate;
