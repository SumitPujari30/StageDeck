import express from 'express';
import {
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  deleteUser,
  getUserStats,
  updateProfile,
} from '../controllers/userManagementController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User profile routes
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/', protect, adminOnly, getAllUsers);
router.get('/pending', protect, adminOnly, getPendingUsers);
router.get('/stats', protect, adminOnly, getUserStats);
router.patch('/:userId/approve', protect, adminOnly, approveUser);
router.patch('/:userId/reject', protect, adminOnly, rejectUser);
router.delete('/:userId', protect, adminOnly, deleteUser);

export default router;
