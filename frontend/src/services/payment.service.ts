import { handleApiError } from './api';

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    clientSecret?: string;
    status: 'pending' | 'succeeded' | 'failed';
}

class PaymentService {
    // Create payment intent (mock)
    async createPaymentIntent(amount: number, currency: string = 'USD'): Promise<PaymentIntent> {
        try {
            // TODO: Connect to backend payment endpoint
            // await api.post('/api/payments/create-intent', { amount, currency });

            // Mock response
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
                id: `pi_${Math.random().toString(36).substr(2, 9)}`,
                amount,
                currency,
                clientSecret: `secret_${Math.random().toString(36).substr(2, 9)}`,
                status: 'pending'
            };
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Confirm payment (mock)
    async confirmPayment(paymentId: string): Promise<PaymentIntent> {
        try {
            // TODO: Connect to backend payment endpoint
            // await api.post(`/api/payments/${paymentId}/confirm`);

            // Mock response
            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
                id: paymentId,
                amount: 0, // Should come from backend
                currency: 'USD',
                status: 'succeeded'
            };
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export default new PaymentService();
