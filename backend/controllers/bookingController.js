import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
    try {
        const { eventId, tickets } = req.body;

        // Get event details
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        // Check if event is available
        if (event.status !== 'Scheduled') {
            return res.status(400).json({
                success: false,
                message: 'Event is not available for booking',
            });
        }

        // Check capacity
        if (event.maxAttendees && (event.attendees + tickets) > event.maxAttendees) {
            return res.status(400).json({
                success: false,
                message: 'Not enough seats available',
            });
        }

        // Calculate total amount
        const totalAmount = (event.price || 0) * tickets;

        // Create booking
        const booking = await Booking.create({
            eventId,
            userId: req.user._id,
            tickets,
            totalAmount,
            status: 'confirmed',
        });

        // Update event attendees count
        event.attendees += tickets;
        await event.save();

        res.status(201).json({
            success: true,
            booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('eventId', 'title description date time location category image price status')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        // Check if user owns this booking or is admin
        if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this booking',
            });
        }

        res.json({
            success: true,
            booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        // Check if user owns this booking
        if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking',
            });
        }

        // Check if booking can be cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled',
            });
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        // Update event attendees count
        const event = await Event.findById(booking.eventId);
        if (event) {
            event.attendees = Math.max(0, event.attendees - booking.tickets);
            await event.save();
        }

        res.json({
            success: true,
            booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
