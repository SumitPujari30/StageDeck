import { useState, useCallback } from 'react';

interface AIResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export const useAI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Get personalized event recommendations
     */
    const getRecommendations = useCallback(async (_userInterests: string[]): Promise<AIResponse> => {
        setLoading(true);
        setError(null);

        try {
            // TODO: Connect to backend Gemini API
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockRecommendations = [
                {
                    id: '1',
                    title: 'Tech Innovation Summit',
                    reason: 'Based on your interest in Technology',
                    matchScore: 95
                },
                {
                    id: '2',
                    title: 'Jazz Night Live',
                    reason: 'Popular among users with similar tastes',
                    matchScore: 88
                }
            ];

            setLoading(false);
            return {
                success: true,
                data: mockRecommendations
            };
        } catch (err: any) {
            setLoading(false);
            setError(err.message || 'Failed to get recommendations');
            return {
                success: false,
                error: err.message
            };
        }
    }, []);

    /**
     * Chat with AI Assistant
     */
    const chatWithAssistant = useCallback(async (message: string): Promise<AIResponse> => {
        setLoading(true);
        setError(null);

        try {
            // TODO: Connect to backend Gemini API
            await new Promise(resolve => setTimeout(resolve, 1000));

            let reply = "I can help you find events, book tickets, or manage your profile.";
            if (message.toLowerCase().includes('music')) {
                reply = "We have several great music events coming up! Check out the 'Jazz Night Live' or 'Summer Music Festival'.";
            } else if (message.toLowerCase().includes('book')) {
                reply = "To book a ticket, simply go to the event page and click 'Book Now'.";
            }

            setLoading(false);
            return {
                success: true,
                data: { message: reply }
            };
        } catch (err: any) {
            setLoading(false);
            setError(err.message || 'Failed to send message');
            return {
                success: false,
                error: err.message
            };
        }
    }, []);

    return {
        loading,
        error,
        getRecommendations,
        chatWithAssistant
    };
};
