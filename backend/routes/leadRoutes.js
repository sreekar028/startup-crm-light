import express from 'express';
import { body } from 'express-validator';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads,
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Apply protect middleware to all lead endpoints
router.use(protect);

// Lead field validation rules
const leadRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('company')
    .trim()
    .notEmpty().withMessage('Company is required'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Status must be a valid pipeline stage'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'])
    .withMessage('Source must be a valid lead source channel'),
  body('value')
    .optional()
    .isNumeric().withMessage('Value must be a number'),
];

// Status patch validation
const statusRules = [
  body('status')
    .notEmpty().withMessage('Status value is required')
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Status must be a valid pipeline stage'),
];

// ── IMPORTANT: Stats and search routes MUST be defined before /:id routes ──
// (otherwise Express will try to cast 'stats' or 'search' as a MongoDB ObjectId)
router.get('/stats/summary', getLeadStats);
router.get('/stats/monthly', getMonthlyStats);
router.get('/search', searchLeads);

// Main CRUD routes
router.route('/')
  .get(getLeads)
  .post(validate(leadRules), createLead);

router.route('/:id')
  .get(getLeadById)
  .put(validate(leadRules), updateLead)
  .delete(deleteLead);

router.patch('/:id/status', validate(statusRules), updateLeadStatus);

export default router;
