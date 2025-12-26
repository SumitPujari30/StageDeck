import express from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,
  verifyOTP,
  resetPassword,
  requestAdminOTP,
  verifyAdminOTP,
  verifyUserRegistrationOTP,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/register', register);
router.post('/verify-user-otp', verifyUserRegistrationOTP);
router.post('/login', login);
router.get('/me', protect, getMe);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Admin registration routes
router.post('/admin/request-otp', requestAdminOTP);
router.post('/admin/verify-otp', verifyAdminOTP);

export default router;
