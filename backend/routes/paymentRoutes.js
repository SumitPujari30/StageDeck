import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getUserPayments,
  getAllTransactions,
  getEventRevenue,
  getPaymentStats,
} from '../controllers/paymentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my-payments', protect, getUserPayments);

// Admin routes
router.get('/transactions', protect, adminOnly, getAllTransactions);
router.get('/event/:eventId/revenue', protect, adminOnly, getEventRevenue);
router.get('/stats', protect, adminOnly, getPaymentStats);

export default router;
