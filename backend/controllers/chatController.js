import { generateChatResponse } from '../utils/gemini.js';

/**
 * @desc    Send message to AI chatbot
 * @route   POST /api/chat/message
 * @access  Public
 */
export const sendMessage = async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message is required',
            });
        }

        // Build user context
        const userContext = {};
        if (req.user) {
            userContext.isAuthenticated = true;
            userContext.userName = req.user.name;
            userContext.userRole = req.user.role;
            userContext.hasBookings = req.user.registeredEvents?.length > 0;
        }

        // Generate AI response
        const aiResponse = await generateChatResponse(
            message,
            conversationHistory || [],
            userContext
        );

        res.json({
            success: true,
            response: aiResponse,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('===== CHAT ERROR =====');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Request body:', req.body);
        console.error('======================');

        res.status(500).json({
            success: false,
            message: 'Failed to process your message. Please try again.',
            error: error.message,
        });
    }
};

/**
 * @desc    Get suggested questions
 * @route   GET /api/chat/suggestions
 * @access  Public
 */
export const getSuggestions = async (req, res) => {
    try {
        const suggestions = req.user?.role === 'admin' ? [
            'How do I create a new event?',
            'How can I view event analytics?',
            'How do I manage user registrations?',
            'How can I feature an event?',
        ] : [
            'What events are happening this week?',
            'How do I book an event?',
            'Can I cancel my booking?',
            'How do I get event recommendations?',
            'What categories of events are available?',
        ];

        res.json({
            success: true,
            suggestions,
        });
    } catch (error) {
        console.error('Suggestions Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get suggestions',
        });
    }
};

export default {
    sendMessage,
    getSuggestions,
};
