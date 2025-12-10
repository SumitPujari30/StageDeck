import express from 'express';
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  toggleFeatured,
  updateEventStatus,
  generateDescription,
  cloneEvent,
  getRecommendations,
} from '../controllers/eventController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getEvents)
  .post(protect, adminOnly, upload.single('image'), createEvent);

router.route('/my-events').get(protect, getMyEvents);

// AI and recommendation routes
router.post('/generate-description', protect, generateDescription);
router.get('/recommendations', protect, getRecommendations);

// Clone event
router.post('/:id/clone', protect, cloneEvent);

router
  .route('/:id')
  .get(getEvent)
  .put(protect, adminOnly, upload.single('image'), updateEvent)
  .delete(protect, adminOnly, deleteEvent);

router.patch('/:id/featured', protect, adminOnly, toggleFeatured);
router.patch('/:id/status', protect, adminOnly, updateEventStatus);

export default router;
