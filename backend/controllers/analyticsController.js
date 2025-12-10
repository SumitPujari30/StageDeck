import Event from '../models/Event.js';
import User from '../models/User.js';
import Registration from '../models/Registration.js';
import Feedback from '../models/Feedback.js';
import Transaction from '../models/Transaction.js';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Count totals
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRegistrations = await Registration.countDocuments();
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    // Events by status
    const eventsByStatus = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    
    // Events by category
    const eventsByCategory = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    
    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRegistrations = await Registration.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });
    
    // Top 5 popular events
    const popularEvents = await Event.find()
      .sort({ attendees: -1 })
      .limit(5)
      .select('title attendees date category image');
    
    // Upcoming events
    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() },
      status: 'Scheduled',
    });
    
    // Average feedback rating
    const avgRating = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
        },
      },
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalEvents,
          totalUsers,
          totalRegistrations,
          totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
          upcomingEvents,
          recentRegistrations,
          averageRating: avgRating.length > 0 ? avgRating[0].averageRating.toFixed(1) : 0,
        },
        eventsByStatus,
        eventsByCategory,
        popularEvents,
      },
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message,
    });
  }
};

/**
 * Get registration trends
 */
export const getRegistrationTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const trends = await Registration.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error('Get Registration Trends Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration trends',
      error: error.message,
    });
  }
};

/**
 * Get revenue trends
 */
export const getRevenueTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const trends = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    console.error('Get Revenue Trends Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue trends',
      error: error.message,
    });
  }
};

/**
 * Get event performance
 */
export const getEventPerformance = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    const registrations = await Registration.countDocuments({ event: eventId });
    const attended = await Registration.countDocuments({ event: eventId, attended: true });
    const feedbacks = await Feedback.find({ event: eventId });
    
    const avgRating = feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0;
    
    const sentimentBreakdown = {
      positive: feedbacks.filter(f => f.sentiment === 'positive').length,
      neutral: feedbacks.filter(f => f.sentiment === 'neutral').length,
      negative: feedbacks.filter(f => f.sentiment === 'negative').length,
    };
    
    const revenue = await Transaction.aggregate([
      {
        $match: {
          event: event._id,
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    
    res.json({
      success: true,
      data: {
        event: {
          title: event.title,
          date: event.date,
          category: event.category,
        },
        registrations,
        attended,
        attendanceRate: registrations > 0 ? ((attended / registrations) * 100).toFixed(2) : 0,
        feedbackCount: feedbacks.length,
        averageRating: avgRating.toFixed(1),
        sentimentBreakdown,
        revenue: revenue.length > 0 ? revenue[0].total : 0,
      },
    });
  } catch (error) {
    console.error('Get Event Performance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event performance',
      error: error.message,
    });
  }
};

/**
 * Get user engagement stats
 */
export const getUserEngagement = async (req, res) => {
  try {
    // Most active users
    const activeUsers = await Registration.aggregate([
      {
        $group: {
          _id: '$user',
          eventCount: { $sum: 1 },
        },
      },
      { $sort: { eventCount: -1 } },
      { $limit: 10 },
    ]);
    
    await User.populate(activeUsers, {
      path: '_id',
      select: 'name email department points',
    });
    
    // User growth
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: thirtyDaysAgo },
    });
    
    res.json({
      success: true,
      data: {
        activeUsers,
        newUsersLast30Days: newUsers,
      },
    });
  } catch (error) {
    console.error('Get User Engagement Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user engagement',
      error: error.message,
    });
  }
};

export default {
  getDashboardStats,
  getRegistrationTrends,
  getRevenueTrends,
  getEventPerformance,
  getUserEngagement,
};
