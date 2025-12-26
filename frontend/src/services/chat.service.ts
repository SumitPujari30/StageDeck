import api, { handleApiError } from './api';

/**
 * Chat service
 */

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'support';
    timestamp: Date;
}

export interface ChatResponse {
    success: boolean;
    response: string;
    timestamp: string;
}

export interface SuggestionsResponse {
    success: boolean;
    suggestions: string[];
}

class ChatService {
    /**
     * Send message to AI chatbot
     */
    async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<ChatResponse> {
        try {
            const response = await api.post<ChatResponse>('/api/chat/message', {
                message,
                conversationHistory: conversationHistory.map(msg => ({
                    text: msg.text,
                    sender: msg.sender,
                })),
            });

            return response.data;
        } catch (error) {
            console.error('Chat service error:', error);
            throw new Error(handleApiError(error));
        }
    }

    /**
     * Get suggested questions
     */
    async getSuggestions(): Promise<string[]> {
        try {
            const response = await api.get<SuggestionsResponse>('/api/chat/suggestions');
            return response.data.suggestions || [];
        } catch (error) {
            console.error('Suggestions service error:', error);
            // Return fallback suggestions
            return [
                'What events are happening this week?',
                'How do I book an event?',
                'Can I cancel my booking?',
            ];
        }
    }
}

export default new ChatService();
