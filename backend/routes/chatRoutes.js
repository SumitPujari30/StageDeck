import express from 'express';
import { sendMessage, getSuggestions } from '../controllers/chatController.js';

/**
 * Chat Routes
 * AI-powered chatbot endpoints
 */

const router = express.Router();

// Send message - public endpoint (works for everyone)
// Note: If user is authenticated, backend will use their context for better responses
router.post('/message', sendMessage);

// Get suggested questions - public endpoint
router.get('/suggestions', getSuggestions);

export default router;
