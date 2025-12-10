import Transaction from '../models/Transaction.js';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { createPaymentIntent, verifyPayment as verifyStripePayment } from '../utils/payment.js';
import { generateRegistrationQR } from '../utils/qrcode.js';
import { sendPaymentConfirmation, sendRegistrationConfirmation } from '../utils/mailer.js';

/**
 * Create payment intent
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    
    // Check if event is paid
    if (event.eventType !== 'paid' || event.price === 0) {
      return res.status(400).json({
        success: false,
        message: 'This is a free event',
      });
    }
    
    // Check if already registered
    const existingRegistration = await Registration.findOne({
      event: eventId,
      user: userId,
    });
    
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event',
      });
    }
    
    // Check if event is full
    if (event.maxAttendees > 0 && event.attendees >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      });
    }
    
    // Get user details
    const user = await User.findById(userId);
    
    // Create Stripe payment intent
    const paymentData = await createPaymentIntent(event.price, eventId, userId, user.email);
    
    res.json({
      success: true,
      data: {
        clientSecret: paymentData.clientSecret,
        paymentIntentId: paymentData.paymentIntentId,
        amount: event.price,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        eventDetails: {
          title: event.title,
          date: event.date,
          venue: event.venue,
        },
      },
    });
  } catch (error) {
    console.error('Create Payment Intent Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message,
    });
  }
};

/**
 * Verify payment and complete registration
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      paymentIntentId,
      eventId,
    } = req.body;
    const userId = req.user._id;
    
    // Verify payment with Stripe
    const paymentVerification = await verifyStripePayment(paymentIntentId);
    
    if (!paymentVerification.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
    
    // Get event and user details
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);
    
    if (!event || !user) {
      return res.status(404).json({
        success: false,
        message: 'Event or user not found',
      });
    }
    
    // Create registration
    const registration = await Registration.create({
      event: eventId,
      user: userId,
      userName: user.name,
      userEmail: user.email,
      status: 'approved',
      paymentInfo: {
        transactionId: paymentIntentId,
        amount: event.price,
        status: 'completed',
        paidAt: new Date(),
      },
    });
    
    // Generate QR code
    const qrCode = await generateRegistrationQR(registration);
    registration.qrCode = qrCode;
    await registration.save();
    
    // Create transaction record
    await Transaction.create({
      event: eventId,
      user: userId,
      registration: registration._id,
      paymentId: paymentIntentId,
      orderId: paymentIntentId,
      amount: event.price,
      status: 'completed',
      paymentGateway: 'stripe',
      gatewayResponse: paymentVerification.paymentIntent,
    });
    
    // Update event
    event.attendees += 1;
    event.registeredUsers.push(userId);
    await event.save();
    
    // Update user
    user.registeredEvents.push(eventId);
    await user.save();
    
    // Send confirmation emails
    await sendPaymentConfirmation(user.email, user.name, {
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
    }, {
      amount: event.price,
      transactionId: paymentIntentId,
    });
    
    await sendRegistrationConfirmation(user.email, user.name, {
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      location: event.location,
    });
    
    res.json({
      success: true,
      message: 'Payment verified and registration completed',
      data: {
        registration,
        transactionId: paymentIntentId,
      },
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

/**
 * Get payment history (User)
 */
export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const transactions = await Transaction.find({ user: userId })
      .populate('event', 'title date venue image')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error('Get User Payments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message,
    });
  }
};

/**
 * Get all transactions (Admin)
 */
export const getAllTransactions = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    const transactions = await Transaction.find(query)
      .populate('event', 'title date category')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    // Calculate total revenue
    const totalRevenue = transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    res.json({
      success: true,
      count: transactions.length,
      totalRevenue,
      data: transactions,
    });
  } catch (error) {
    console.error('Get All Transactions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message,
    });
  }
};

/**
 * Get event revenue (Admin)
 */
export const getEventRevenue = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const transactions = await Transaction.find({
      event: eventId,
      status: 'completed',
    });
    
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    res.json({
      success: true,
      eventId,
      totalTransactions: transactions.length,
      totalRevenue,
      data: transactions,
    });
  } catch (error) {
    console.error('Get Event Revenue Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event revenue',
      error: error.message,
    });
  }
};

/**
 * Get payment statistics (Admin)
 */
export const getPaymentStats = async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const completedTransactions = await Transaction.countDocuments({ status: 'completed' });
    const failedTransactions = await Transaction.countDocuments({ status: 'failed' });
    
    const revenueData = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    
    // Revenue by event
    const revenueByEvent = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$event',
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);
    
    // Populate event details
    await Transaction.populate(revenueByEvent, {
      path: '_id',
      select: 'title date category',
    });
    
    res.json({
      success: true,
      stats: {
        totalTransactions,
        completedTransactions,
        failedTransactions,
        totalRevenue,
        successRate: totalTransactions > 0
          ? ((completedTransactions / totalTransactions) * 100).toFixed(2)
          : 0,
      },
      topEvents: revenueByEvent,
    });
  } catch (error) {
    console.error('Get Payment Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics',
      error: error.message,
    });
  }
};

export default {
  createPaymentOrder,
  verifyPayment,
  getUserPayments,
  getAllTransactions,
  getEventRevenue,
  getPaymentStats,
};
