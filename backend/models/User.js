import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema definition for authentication and access roles.
 */
export const UserSchema = new mongoose.Schema(
  {
    /**
     * User's full name.
     * Trimmed, between 2 and 50 characters.
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    /**
     * User's email address.
     * Unique, lowercase, validated format.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email must be a valid email address',
      ],
    },
    /**
     * Hashed bcrypt user password.
     * Minimum 6 characters.
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Prevents returning by default
    },
    /**
     * User role in the application.
     * Must be 'admin' or 'user'. Defaults to 'user'.
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either admin or user',
      },
      default: 'user',
    },
    /**
     * Active state flag for locking accounts.
     * Defaults to true.
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware: hash password before saving if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare candidate password with database hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Override toJSON to remove password field
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', UserSchema);

export default User;
