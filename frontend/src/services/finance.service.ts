import api, { ApiResponse, handleApiError } from './api';

/**
 * Finance service for financial operations and reporting
 */

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  refundAmount: number;
  pendingPayments: number;
}

export interface Transaction {
  id: string;
  type: 'booking' | 'refund' | 'payout' | 'fee';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  bookingId?: string;
  userId: string;
  userName: string;
  eventName?: string;
  paymentMethod: string;
  timestamp: string;
  description: string;
}

export interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
  refunds: number;
}

class FinanceService {
  /**
   * Get financial summary
   */
  async getSummary(period: 'week' | 'month' | 'year' = 'month'): Promise<FinancialSummary> {
    try {
      const response = await api.get<{ success: boolean; summary: FinancialSummary }>(
        `/api/admin/financials/summary?period=${period}`
      );
      return response.data.summary;
    } catch (error) {
      // Mock data fallback
      console.warn('Financial summary endpoint not available, using mock data');
      return {
        totalRevenue: 125000,
        totalExpenses: 45000,
        netProfit: 80000,
        profitMargin: 64,
        refundAmount: 5000,
        pendingPayments: 12000,
      };
    }
  }

  /**
   * Get revenue trend data
   */
  async getRevenueTrend(days: number = 30): Promise<RevenueData[]> {
    try {
      const response = await api.get<{ success: boolean; data: RevenueData[] }>(
        `/api/admin/financials/revenue-trend?days=${days}`
      );
      return response.data.data;
    } catch (error) {
      // Mock data fallback
      console.warn('Revenue trend endpoint not available, using mock data');
      const mockData: RevenueData[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        mockData.push({
          date: date.toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 5000) + 1000,
          bookings: Math.floor(Math.random() * 20) + 5,
          refunds: Math.floor(Math.random() * 3),
        });
      }
      return mockData;
    }
  }

  /**
   * Get transactions
   */
  async getTransactions(filters?: {
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ transactions: Transaction[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/api/admin/financials/transactions?${params.toString()}`);
      return response.data;
    } catch (error) {
      // Mock data fallback
      console.warn('Transactions endpoint not available, using mock data');
      return {
        transactions: [],
        total: 0,
      };
    }
  }

  /**
   * Process refund
   */
  async processRefund(bookingId: string, amount: number, reason?: string): Promise<ApiResponse> {
    try {
      const response = await api.post(`/api/admin/bookings/${bookingId}/refund`, {
        amount,
        reason,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Export financial report
   */
  async exportReport(
    format: 'csv' | 'pdf' = 'pdf',
    period: 'week' | 'month' | 'year' = 'month'
  ): Promise<Blob> {
    try {
      const response = await api.get(
        `/api/admin/financials/export?format=${format}&period=${period}`,
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Schedule automated report
   */
  async scheduleReport(
    frequency: 'daily' | 'weekly' | 'monthly',
    recipients: string[],
    format: 'csv' | 'pdf' = 'pdf'
  ): Promise<ApiResponse> {
    try {
      const response = await api.post('/api/admin/financials/schedule-report', {
        frequency,
        recipients,
        format,
      });
      return response.data;
    } catch (error) {
      // TODO: Implement backend endpoint
      console.warn('Schedule report endpoint not implemented');
      throw new Error('Feature requires backend implementation');
    }
  }
}

export default new FinanceService();
