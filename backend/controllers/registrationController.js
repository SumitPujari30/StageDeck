import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { generateRegistrationQR } from '../utils/qrcode.js';
import { sendRegistrationConfirmation, sendRegistrationStatusUpdate } from '../utils/mailer.js';

/**
 * Register user for an event
 */
export const registerForEvent = async (req, res) => {
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
    
    // Create registration
    const registration = await Registration.create({
      event: eventId,
      user: userId,
      userName: user.name,
      userEmail: user.email,
      status: 'approved', // Auto-approve for free events
    });
    
    // Generate QR code
    const qrCode = await generateRegistrationQR(registration);
    registration.qrCode = qrCode;
    await registration.save();
    
    // Update event attendees count
    event.attendees += 1;
    event.registeredUsers.push(userId);
    await event.save();
    
    // Update user registered events
    user.registeredEvents.push(eventId);
    await user.save();
    
    // Send confirmation email
    await sendRegistrationConfirmation(user.email, user.name, {
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      location: event.location,
    });
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: registration,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

/**
 * Get user registrations
 */
export const getUserRegistrations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const registrations = await Registration.find({ user: userId })
      .populate('event')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error('Get Registrations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
      error: error.message,
    });
  }
};

/**
 * Get event registrations (Admin)
 */
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email department phone')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error('Get Event Registrations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event registrations',
      error: error.message,
    });
  }
};

/**
 * Update registration status (Admin)
 */
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body;
    
    const registration = await Registration.findById(registrationId).populate('event user');
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }
    
    const oldStatus = registration.status;
    registration.status = status;
    await registration.save();
    
    // Send email notification if status changed
    if (oldStatus !== status && (status === 'approved' || status === 'rejected')) {
      await sendRegistrationStatusUpdate(
        registration.userEmail,
        registration.userName,
        registration.event.title,
        status
      );
    }
    
    res.json({
      success: true,
      message: 'Registration status updated',
      data: registration,
    });
  } catch (error) {
    console.error('Update Registration Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration status',
      error: error.message,
    });
  }
};

/**
 * Mark attendance (Admin)
 */
export const markAttendance = async (req, res) => {
  try {
    const { registrationId } = req.params;
    
    const registration = await Registration.findById(registrationId);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }
    
    registration.attended = true;
    registration.checkInTime = new Date();
    await registration.save();
    
    // Update user attended events
    const user = await User.findById(registration.user);
    if (!user.attendedEvents.includes(registration.event)) {
      user.attendedEvents.push(registration.event);
      user.points += 10; // Award points for attendance
      await user.save();
    }
    
    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: registration,
    });
  } catch (error) {
    console.error('Mark Attendance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message,
    });
  }
};

/**
 * Cancel registration
 */
export const cancelRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const userId = req.user._id;
    
    const registration = await Registration.findOne({
      _id: registrationId,
      user: userId,
    });
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }
    
    // Update event attendees count
    const event = await Event.findById(registration.event);
    if (event) {
      event.attendees = Math.max(0, event.attendees - 1);
      event.registeredUsers = event.registeredUsers.filter(
        id => id.toString() !== userId.toString()
      );
      await event.save();
    }
    
    // Update user registered events
    const user = await User.findById(userId);
    user.registeredEvents = user.registeredEvents.filter(
      id => id.toString() !== registration.event.toString()
    );
    await user.save();
    
    // Delete registration
    await registration.deleteOne();
    
    res.json({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration',
      error: error.message,
    });
  }
};

/**
 * Get registration by ID
 */
export const getRegistrationById = async (req, res) => {
  try {
    const { registrationId } = req.params;
    
    const registration = await Registration.findById(registrationId)
      .populate('event')
      .populate('user', 'name email department phone');
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }
    
    res.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error('Get Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration',
      error: error.message,
    });
  }
};

export default {
  registerForEvent,
  getUserRegistrations,
  getEventRegistrations,
  updateRegistrationStatus,
  markAttendance,
  cancelRegistration,
  getRegistrationById,
};
