import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'attended'],
      default: 'approved', // Auto-approve by default
    },
    qrCode: {
      type: String, // Base64 encoded QR code
    },
    paymentInfo: {
      transactionId: String,
      amount: Number,
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
      },
      paidAt: Date,
    },
    checkInTime: {
      type: Date,
    },
    attended: {
      type: Boolean,
      default: false,
    },
    certificateGenerated: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
registrationSchema.index({ event: 1, user: 1 }, { unique: true });
registrationSchema.index({ status: 1 });
registrationSchema.index({ user: 1 });
registrationSchema.index({ event: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
