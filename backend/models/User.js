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
      enum: ['user', 'admin', 'organizer'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: true, // Users are verified by default, admins need OTP
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // Auto-approve users on registration
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
    avatar: {
      type: String, // Base64 encoded profile image
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
  // Default to 10 minutes if not set
  const expireMinutes = parseInt(process.env.OTP_EXPIRE_MINUTES || '10');
  this.otpExpire = Date.now() + expireMinutes * 60 * 1000;
  console.log(`OTP set for ${this.email}, expires in ${expireMinutes} minutes at ${new Date(this.otpExpire).toISOString()}`);
};

// Verify OTP
userSchema.methods.verifyOTP = async function (enteredOTP) {
  console.log(`Verifying OTP for ${this.email}`);
  console.log(`Has OTP: ${!!this.otp}, Has Expire: ${!!this.otpExpire}`);

  if (!this.otp || !this.otpExpire) {
    console.log('OTP verification failed: No OTP or expiry set');
    return false;
  }

  const now = Date.now();
  const expireTime = new Date(this.otpExpire).getTime();
  console.log(`Current time: ${now}, Expire time: ${expireTime}, Expired: ${now > expireTime}`);

  if (now > expireTime) {
    console.log('OTP verification failed: OTP expired');
    return false; // OTP expired
  }

  const isMatch = await bcrypt.compare(enteredOTP, this.otp);
  console.log(`OTP comparison result: ${isMatch}`);
  return isMatch;
};

// Clear OTP fields
userSchema.methods.clearOTP = function () {
  this.otp = undefined;
  this.otpExpire = undefined;
};

const User = mongoose.model('User', userSchema);

export default User;
