import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral',
    },
    sentimentScore: {
      type: Number,
      default: 0,
    },
    aiAnalysis: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
feedbackSchema.index({ event: 1 });
feedbackSchema.index({ user: 1, event: 1 }, { unique: true });
feedbackSchema.index({ sentiment: 1 });
feedbackSchema.index({ rating: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
