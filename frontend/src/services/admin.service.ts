import api, { ApiResponse, handleApiError } from './api';

/**
 * Admin service for administrative operations
 */

export interface AdminStats {
  totalBookings: number;
  activeEvents: number;
  totalRevenue: number;
  totalUsers: number;
  feedbackRating: number;
  revenueGrowth: number;
  userGrowth: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  timestamp: string;
}

class AdminService {
  /**
   * Get admin dashboard statistics
   */
  async getStats(): Promise<AdminStats> {
    try {
      const response = await api.get<{ success: boolean; stats: AdminStats }>('/api/admin/stats');
      return response.data.stats;
    } catch (error) {
      // Fallback to mock data if endpoint not available
      console.warn('Admin stats endpoint not available, using mock data');
      return {
        totalBookings: 248,
        activeEvents: 12,
        totalRevenue: 125000,
        totalUsers: 348,
        feedbackRating: 4.7,
        revenueGrowth: 23.1,
        userGrowth: 15.3,
      };
    }
  }

  /**
   * Duplicate an existing event
   */
  async duplicateEvent(eventId: string): Promise<any> {
    try {
      const response = await api.post(`/api/admin/events/${eventId}/duplicate`);
      return response.data.event;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Ban a user
   */
  async banUser(userId: string, reason?: string): Promise<ApiResponse> {
    try {
      const response = await api.post(`/api/admin/users/${userId}/ban`, { reason });
      return response.data;
    } catch (error) {
      // TODO: Implement backend endpoint
      console.warn('Ban user endpoint not implemented');
      throw new Error('Feature requires backend implementation');
    }
  }

  /**
   * Unban a user
   */
  async unbanUser(userId: string): Promise<ApiResponse> {
    try {
      const response = await api.post(`/api/admin/users/${userId}/unban`);
      return response.data;
    } catch (error) {
      // TODO: Implement backend endpoint
      console.warn('Unban user endpoint not implemented');
      throw new Error('Feature requires backend implementation');
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: string): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/api/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      // TODO: Implement backend endpoint
      console.warn('Update user role endpoint not implemented');
      throw new Error('Feature requires backend implementation');
    }
  }

  /**
   * Send bulk email to users
   */
  async sendBulkEmail(userIds: string[], subject: string, body: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/api/admin/users/bulk-email', { userIds, subject, body });
      return response.data;
    } catch (error) {
      // TODO: Implement backend endpoint
      console.warn('Bulk email endpoint not implemented');
      throw new Error('Feature requires backend implementation');
    }
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.action) params.append('action', filters.action);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/api/admin/audit-logs?${params.toString()}`);
      return response.data;
    } catch (error) {
      // TODO: Implement backend endpoint
      console.warn('Audit logs endpoint not implemented, returning mock data');
      return {
        logs: [],
        total: 0,
      };
    }
  }

  /**
   * Export audit logs
   */
  async exportAuditLogs(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    try {
      const response = await api.get(`/api/admin/audit-logs/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new AdminService();
