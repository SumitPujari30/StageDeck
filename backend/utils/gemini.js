import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate event description from keywords using Gemini AI
 */
export const generateEventDescription = async (keywords) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a compelling and professional event description for a college event based on these keywords: "${keywords}". 
    The description should be:
    - Between 150-250 words
    - Engaging and informative
    - Suitable for college students
    - Include what attendees will learn or experience
    - Professional yet friendly tone
    
    Just provide the description without any additional formatting or labels.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error('Failed to generate event description');
  }
};

/**
 * Analyze feedback sentiment using Gemini AI
 */
export const analyzeFeedbackSentiment = async (feedbackText, rating) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze the sentiment of this event feedback (Rating: ${rating}/5):
    "${feedbackText}"
    
    Provide a JSON response with:
    1. sentiment: "positive", "neutral", or "negative"
    2. score: a number between -1 (very negative) and 1 (very positive)
    3. summary: a brief 1-sentence analysis
    
    Response format: {"sentiment": "...", "score": 0.0, "summary": "..."}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return analysis;
    }

    // Fallback based on rating
    return {
      sentiment: rating >= 4 ? 'positive' : rating >= 3 ? 'neutral' : 'negative',
      score: (rating - 3) / 2,
      summary: 'Sentiment analysis based on rating.',
    };
  } catch (error) {
    console.error('Gemini AI Sentiment Analysis Error:', error);
    // Fallback sentiment based on rating
    return {
      sentiment: rating >= 4 ? 'positive' : rating >= 3 ? 'neutral' : 'negative',
      score: (rating - 3) / 2,
      summary: 'Sentiment analysis based on rating.',
    };
  }
};

/**
 * Generate event recommendations for a user
 */
export const generateEventRecommendations = async (userInterests, userHistory, availableEvents) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Based on a user's interests: ${userInterests.join(', ')} and their event history categories: ${userHistory.join(', ')},
    recommend the top 3 most relevant events from this list:
    ${availableEvents.map((e, i) => `${i + 1}. ${e.title} (Category: ${e.category}, Tags: ${e.tags?.join(', ') || 'none'})`).join('\n')}
    
    Return only the event numbers (1, 2, 3, etc.) as a comma-separated list of the top 3 recommendations.
    Example: 1,3,5`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Parse the recommended indices
    const indices = text.match(/\d+/g)?.map(n => parseInt(n) - 1) || [];
    return indices.slice(0, 3);
  } catch (error) {
    console.error('Gemini AI Recommendations Error:', error);
    // Fallback: return first 3 events
    return [0, 1, 2];
  }
};

/**
 * Generate feedback summary for admin dashboard
 */
export const generateFeedbackSummary = async (feedbacks) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const feedbackTexts = feedbacks.map(f => `Rating ${f.rating}/5: ${f.comment}`).join('\n');

    const prompt = `Summarize these event feedbacks in 2-3 sentences, highlighting key themes and overall sentiment:
    ${feedbackTexts}
    
    Provide a concise summary that would be useful for event organizers.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Gemini AI Summary Error:', error);
    return 'Unable to generate summary at this time.';
  }
};

/**
 * Generate intelligent chat response with project context
 */
export const generateChatResponse = async (userMessage, conversationHistory = [], userContext = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build context about StageDeck platform
    const platformContext = `You are a helpful AI assistant for StageDeck, an event management platform.

PLATFORM INFORMATION:
- StageDeck helps users discover, browse, and book events
- Users can browse events by category, search, and get personalized recommendations
- Event categories: Technology, Business, Music, Sports, Arts, Education, Health, Food
- Features: Event booking, user profiles, notifications, event management

USER CAPABILITIES:
- Browse and search events by category, date, location
- Book event tickets (free or paid events)
- View booking history and manage bookings
- Get AI-powered event recommendations
- Receive notifications about events
- Manage user profile and preferences

ADMIN CAPABILITIES:
- Create and manage events with details and images
- View analytics, bookings, and user feedback
- Manage user registrations and approvals
- Feature events to highlight them
- Access admin dashboard with insights

COMMON QUESTIONS YOU CAN HELP WITH:
- How to book events
- Finding events by category or date
- Managing bookings and cancellations
- Account and profile management
- Payment and ticketing questions
- Platform navigation help
- Event creation (for admins)

RESPONSE GUIDELINES:
- Be friendly, helpful, and concise
- Provide specific steps when explaining processes
- Reference actual platform features accurately
- If you don't know something specific, suggest contacting support
- Keep responses under 150 words unless detailed explanation needed`;

    // Add user context if available
    let userInfo = '';
    if (userContext.isAuthenticated) {
      userInfo = `\nUSER CONTEXT:
- User: ${userContext.userName || 'Guest'}
- Role: ${userContext.userRole || 'User'}
- Has bookings: ${userContext.hasBookings ? 'Yes' : 'No'}`;
    }

    // Build conversation history
    let historyText = '';
    if (conversationHistory.length > 0) {
      historyText = '\nCONVERSATION HISTORY:\n' +
        conversationHistory.slice(-6).map(msg =>
          `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
        ).join('\n');
    }

    // Combine everything into the prompt
    const prompt = `${platformContext}${userInfo}${historyText}

Current User Question: ${userMessage}

Provide a helpful and concise response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Gemini AI Chat Error:', error);
    throw new Error('Failed to generate chat response');
  }
};

export default {
  generateEventDescription,
  analyzeFeedbackSentiment,
  generateEventRecommendations,
  generateFeedbackSummary,
  generateChatResponse,
};
