import express from 'express';
import {
    createBooking,
    getMyBookings,
    getAllBookings,
    getBooking,
    cancelBooking,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, adminOnly, getAllBookings);

router.route('/my-bookings').get(protect, getMyBookings);

router.route('/:id').get(protect, getBooking);

router.route('/:id/cancel').patch(protect, cancelBooking);

export default router;
