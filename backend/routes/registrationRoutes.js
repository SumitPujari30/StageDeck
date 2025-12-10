import express from 'express';
import {
  registerForEvent,
  getUserRegistrations,
  getEventRegistrations,
  updateRegistrationStatus,
  markAttendance,
  cancelRegistration,
  getRegistrationById,
} from '../controllers/registrationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, registerForEvent);
router.get('/my-registrations', protect, getUserRegistrations);
router.get('/:registrationId', protect, getRegistrationById);
router.delete('/:registrationId', protect, cancelRegistration);

// Admin routes
router.get('/event/:eventId', protect, adminOnly, getEventRegistrations);
router.patch('/:registrationId/status', protect, adminOnly, updateRegistrationStatus);
router.patch('/:registrationId/attendance', protect, adminOnly, markAttendance);

export default router;
