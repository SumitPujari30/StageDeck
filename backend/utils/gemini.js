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

export default {
  generateEventDescription,
  analyzeFeedbackSentiment,
  generateEventRecommendations,
  generateFeedbackSummary,
};
