import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
      default: '#6366f1',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    eventCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
