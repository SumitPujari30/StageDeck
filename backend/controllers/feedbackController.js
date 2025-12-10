import Feedback from '../models/Feedback.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import User from '../models/User.js';
import { analyzeFeedbackSentiment, generateFeedbackSummary } from '../utils/gemini.js';
import { sendFeedbackThankYou } from '../utils/mailer.js';

/**
 * Submit feedback for an event
 */
export const submitFeedback = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;
    const userId = req.user._id;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    // Check if user attended the event
    const registration = await Registration.findOne({
      event: eventId,
      user: userId,
      attended: true,
    });
    
    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'You must attend the event to submit feedback',
      });
    }
    
    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({
      event: eventId,
      user: userId,
    });
    
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already submitted for this event',
      });
    }
    
    // Get user details
    const user = await User.findById(userId);
    
    // Analyze sentiment using Gemini AI
    let sentimentData = {
      sentiment: 'neutral',
      score: 0,
      summary: '',
    };
    
    try {
      sentimentData = await analyzeFeedbackSentiment(comment, rating);
    } catch (error) {
      console.error('Sentiment analysis failed, using fallback');
    }
    
    // Create feedback
    const feedback = await Feedback.create({
      event: eventId,
      user: userId,
      userName: user.name,
      rating,
      comment,
      sentiment: sentimentData.sentiment,
      sentimentScore: sentimentData.score,
      aiAnalysis: sentimentData.summary,
    });
    
    // Award points to user
    user.points += 5;
    await user.save();
    
    // Send thank you email
    await sendFeedbackThankYou(user.email, user.name, event.title);
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    console.error('Submit Feedback Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message,
    });
  }
};

/**
 * Get event feedbacks (Admin)
 */
export const getEventFeedbacks = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const feedbacks = await Feedback.find({ event: eventId })
      .populate('user', 'name email department')
      .sort({ createdAt: -1 });
    
    // Calculate statistics
    const stats = {
      total: feedbacks.length,
      averageRating: feedbacks.length > 0
        ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
        : 0,
      sentimentBreakdown: {
        positive: feedbacks.filter(f => f.sentiment === 'positive').length,
        neutral: feedbacks.filter(f => f.sentiment === 'neutral').length,
        negative: feedbacks.filter(f => f.sentiment === 'negative').length,
      },
      ratingBreakdown: {
        5: feedbacks.filter(f => f.rating === 5).length,
        4: feedbacks.filter(f => f.rating === 4).length,
        3: feedbacks.filter(f => f.rating === 3).length,
        2: feedbacks.filter(f => f.rating === 2).length,
        1: feedbacks.filter(f => f.rating === 1).length,
      },
    };
    
    res.json({
      success: true,
      count: feedbacks.length,
      stats,
      data: feedbacks,
    });
  } catch (error) {
    console.error('Get Event Feedbacks Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks',
      error: error.message,
    });
  }
};

/**
 * Get all feedbacks (Admin)
 */
export const getAllFeedbacks = async (req, res) => {
  try {
    const { sentiment, rating, limit = 50 } = req.query;
    
    const query = {};
    if (sentiment) query.sentiment = sentiment;
    if (rating) query.rating = parseInt(rating);
    
    const feedbacks = await Feedback.find(query)
      .populate('event', 'title date category')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error('Get All Feedbacks Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks',
      error: error.message,
    });
  }
};

/**
 * Get feedback summary for an event (Admin)
 */
export const getFeedbackSummary = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const feedbacks = await Feedback.find({ event: eventId });
    
    if (feedbacks.length === 0) {
      return res.json({
        success: true,
        message: 'No feedbacks available',
        summary: 'No feedback has been submitted for this event yet.',
      });
    }
    
    // Generate AI summary
    let summary = 'Unable to generate summary at this time.';
    try {
      summary = await generateFeedbackSummary(feedbacks);
    } catch (error) {
      console.error('Summary generation failed');
    }
    
    res.json({
      success: true,
      summary,
      totalFeedbacks: feedbacks.length,
    });
  } catch (error) {
    console.error('Get Feedback Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate feedback summary',
      error: error.message,
    });
  }
};

/**
 * Get user's feedback
 */
export const getUserFeedbacks = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const feedbacks = await Feedback.find({ user: userId })
      .populate('event', 'title date category image')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error('Get User Feedbacks Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks',
      error: error.message,
    });
  }
};

/**
 * Delete feedback (Admin)
 */
export const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    
    const feedback = await Feedback.findById(feedbackId);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }
    
    await feedback.deleteOne();
    
    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    console.error('Delete Feedback Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message,
    });
  }
};

export default {
  submitFeedback,
  getEventFeedbacks,
  getAllFeedbacks,
  getFeedbackSummary,
  getUserFeedbacks,
  deleteFeedback,
};
