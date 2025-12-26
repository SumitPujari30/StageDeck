import express from 'express';
import { uploadEventImage } from '../controllers/uploadController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

/**
 * Upload Routes
 * Handles file upload endpoints
 */

const router = express.Router();

// Upload event image
router.post('/event-image', protect, adminOnly, upload.single('image'), uploadEventImage);

export default router;
