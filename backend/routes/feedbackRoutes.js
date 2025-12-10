import express from 'express';
import {
  submitFeedback,
  getEventFeedbacks,
  getAllFeedbacks,
  getFeedbackSummary,
  getUserFeedbacks,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, submitFeedback);
router.get('/my-feedbacks', protect, getUserFeedbacks);

// Admin routes
router.get('/all', protect, adminOnly, getAllFeedbacks);
router.get('/event/:eventId', protect, adminOnly, getEventFeedbacks);
router.get('/event/:eventId/summary', protect, adminOnly, getFeedbackSummary);
router.delete('/:feedbackId', protect, adminOnly, deleteFeedback);

export default router;
