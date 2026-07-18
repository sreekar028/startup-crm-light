import mongoose from 'mongoose';

/**
 * Lead Schema definition for sales prospects.
 */
export const LeadSchema = new mongoose.Schema(
  {
    /**
     * Prospect's full name.
     * Trimmed, between 2 and 100 characters.
     */
    name: {
      type: String,
      required: [true, 'Lead Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    /**
     * Company name the prospect belongs to.
     * Trimmed.
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    /**
     * Contact email address.
     * Trimmed, validated format.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email must be a valid email address',
      ],
    },
    /**
     * Optional phone number.
     * Trimmed.
     */
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    /**
     * Value in rupees of the potential deal.
     * Defaults to 0.
     */
    value: {
      type: Number,
      default: 0,
    },
    /**
     * Sales pipeline status stage.
     * Must be one of the enum values. Defaults to 'New'.
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: 'Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost',
      },
      default: 'New',
    },
    /**
     * Acquisition channel source.
     * Must be one of the enum values. Defaults to 'Website'.
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: 'Source must be one of: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other',
      },
      default: 'Website',
    },
    /**
     * Optional notes/description about interactions with this prospect.
     * Max length 1000 characters.
     */
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    /**
     * Reference to the User owner of this lead.
     * Used for database isolation between users.
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead must belong to a user'],
    },
    /**
     * Date when the lead status was changed to Won.
     * Set dynamically.
     */
    wonAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for owner + status filtering (most common query pattern)
LeadSchema.index({ owner: 1, status: 1 });

// Compound index for owner + createdAt — used by pagination, date-range, and aggregation
LeadSchema.index({ owner: 1, createdAt: -1 });

// Compound index for owner + source filtering
LeadSchema.index({ owner: 1, source: 1 });

// Index on email for fast lookups
LeadSchema.index({ email: 1 });

// Virtual field: age in days since creation
LeadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  const diffTime = Math.abs(new Date() - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Update wonAt timestamp if status changes to Won
LeadSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'Won') {
    this.wonAt = new Date();
  }
  next();
});

const Lead = mongoose.model('Lead', LeadSchema);

export default Lead;
