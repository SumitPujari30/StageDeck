import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
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
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
    },
    paymentGateway: {
      type: String,
      enum: ['stripe'],
      default: 'stripe',
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    refundId: {
      type: String,
    },
    refundedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
transactionSchema.index({ event: 1 });
transactionSchema.index({ user: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ paymentId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
