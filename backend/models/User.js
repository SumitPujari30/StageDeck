import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: true, // Users are verified by default, admins need OTP
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending', // New users need admin approval
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpire: {
      type: Date,
      select: false,
    },
    department: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
    },
    interests: [{
      type: String,
    }],
    registeredEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }],
    attendedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }],
    points: {
      type: Number,
      default: 0,
    },
    badges: [{
      name: String,
      icon: String,
      earnedAt: Date,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash OTP before saving
userSchema.methods.setOTP = async function (otp) {
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(otp, salt);
  this.otpExpire = Date.now() + parseInt(process.env.OTP_EXPIRE_MINUTES || 5) * 60 * 1000;
};

// Verify OTP
userSchema.methods.verifyOTP = async function (enteredOTP) {
  if (!this.otp || !this.otpExpire) {
    return false;
  }
  
  if (Date.now() > this.otpExpire) {
    return false; // OTP expired
  }
  
  return await bcrypt.compare(enteredOTP, this.otp);
};

// Clear OTP fields
userSchema.methods.clearOTP = function () {
  this.otp = undefined;
  this.otpExpire = undefined;
};

const User = mongoose.model('User', userSchema);

export default User;
