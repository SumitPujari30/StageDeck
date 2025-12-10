import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an event description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide an event time'],
    },
    location: {
      type: String,
      required: [true, 'Please provide an event location'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide an event category'],
      enum: ['Technology', 'Business', 'Music', 'Art', 'Food', 'Health', 'Networking', 'General'],
      default: 'General',
    },
    venue: {
      type: String,
      required: [true, 'Please provide a venue'],
      trim: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    eventType: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free',
    },
    maxAttendees: {
      type: Number,
      default: 0, // 0 means unlimited
    },
    attendees: {
      type: Number,
      default: 0,
      min: [0, 'Attendees cannot be negative'],
    },
    registeredUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    status: {
      type: String,
      enum: ['Scheduled', 'Draft', 'Cancelled', 'Completed'],
      default: 'Scheduled',
    },
    tags: [{
      type: String,
    }],
    rules: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    createdByName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ creator: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ isFeatured: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
