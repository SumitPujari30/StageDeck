import Stripe from 'stripe';

// Initialize Stripe instance only if credentials are available
let stripe = null;

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[Stripe] STRIPE_SECRET_KEY not found. Payment features are disabled until the key is provided.');
} else {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * Create a Stripe payment intent
 */
export const createPaymentIntent = async (amount, eventId, userId, userEmail) => {
  try {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in the environment variables.');
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        eventId,
        userId,
      },
      receipt_email: userEmail,
    });
    
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    throw new Error('Failed to create payment intent');
  }
};

/**
 * Verify Stripe payment
 */
export const verifyPayment = async (paymentIntentId) => {
  try {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in the environment variables.');
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      success: paymentIntent.status === 'succeeded',
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      paymentIntent,
    };
  } catch (error) {
    console.error('Payment Verification Error:', error);
    throw new Error('Failed to verify payment');
  }
};

/**
 * Fetch payment details
 */
export const fetchPaymentDetails = async (paymentIntentId) => {
  try {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in the environment variables.');
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      payment: paymentIntent,
    };
  } catch (error) {
    console.error('Fetch Payment Error:', error);
    throw new Error('Failed to fetch payment details');
  }
};

/**
 * Initiate refund
 */
export const initiateRefund = async (paymentIntentId, amount) => {
  try {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in the environment variables.');
    }
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
    });
    
    return {
      success: true,
      refundId: refund.id,
      status: refund.status,
    };
  } catch (error) {
    console.error('Refund Error:', error);
    throw new Error('Failed to initiate refund');
  }
};

export default {
  createPaymentIntent,
  verifyPayment,
  fetchPaymentDetails,
  initiateRefund,
};
