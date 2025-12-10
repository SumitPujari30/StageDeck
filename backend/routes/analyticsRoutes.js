import express from 'express';
import {
  getDashboardStats,
  getRegistrationTrends,
  getRevenueTrends,
  getEventPerformance,
  getUserEngagement,
} from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are admin-only
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/registrations/trends', getRegistrationTrends);
router.get('/revenue/trends', getRevenueTrends);
router.get('/event/:eventId/performance', getEventPerformance);
router.get('/users/engagement', getUserEngagement);

export default router;
