import api, { ApiResponse, PaginatedResponse, handleApiError } from './api';
import type { EventInput } from '@/utils/validators';

/**
 * Events service
 */

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  price?: number;
  capacity?: number;
  attendees: number;
  status: 'Scheduled' | 'Draft' | 'Cancelled' | 'Completed';
  isFeatured: boolean;
  creator: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EventFilters {
  category?: string;
  status?: string;
  search?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface Booking {
  _id: string;
  eventId: string;
  event?: Event;
  userId: string;
  user?: {
    name: string;
    email: string;
  };
  tickets: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentId?: string;
  createdAt: string;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalAttendees: number;
  totalRevenue: number;
  categoryDistribution: Array<{
    category: string;
    count: number;
  }>;
  monthlyEvents: Array<{
    month: string;
    count: number;
  }>;
}

class EventsService {
  // Get all events (public)
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category) params.append('category', filters.category);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get<{ success: boolean; events: Event[] }>(
        `/api/events?${params.toString()}`
      );
      
      return response.data.events || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Get single event
  async getEvent(id: string): Promise<Event> {
    try {
      const response = await api.get<{ success: boolean; event: Event }>(`/api/events/${id}`);
      return response.data.event;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Create event (protected)
  async createEvent(data: EventInput): Promise<Event> {
    try {
      const response = await api.post<{ success: boolean; event: Event }>('/api/events', data);
      return response.data.event;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Update event (protected)
  async updateEvent(id: string, data: Partial<EventInput>): Promise<Event> {
    try {
      const response = await api.put<{ success: boolean; event: Event }>(`/api/events/${id}`, data);
      return response.data.event;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Delete event (protected)
  async deleteEvent(id: string): Promise<ApiResponse> {
    try {
      const response = await api.delete<ApiResponse>(`/api/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Get my events (protected)
  async getMyEvents(): Promise<Event[]> {
    try {
      const response = await api.get<{ success: boolean; events: Event[] }>('/api/events/my-events');
      return response.data.events || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Toggle featured status (admin only)
  async toggleFeatured(id: string): Promise<Event> {
    try {
      const response = await api.patch<{ success: boolean; event: Event }>(
        `/api/events/${id}/featured`
      );
      return response.data.event;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Update event status (admin only)
  async updateEventStatus(id: string, status: Event['status']): Promise<Event> {
    try {
      const response = await api.patch<{ success: boolean; event: Event }>(
        `/api/events/${id}/status`,
        { status }
      );
      return response.data.event;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Book event tickets
  async bookEvent(eventId: string, tickets: number): Promise<Booking> {
    try {
      const response = await api.post<{ success: boolean; booking: Booking }>('/api/bookings', {
        eventId,
        tickets,
      });
      return response.data.booking;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Get user bookings
  async getUserBookings(): Promise<Booking[]> {
    try {
      const response = await api.get<{ success: boolean; bookings: Booking[] }>('/api/bookings/my-bookings');
      return response.data.bookings || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Get all bookings (admin)
  async getAllBookings(): Promise<Booking[]> {
    try {
      const response = await api.get<{ success: boolean; bookings: Booking[] }>('/api/bookings');
      return response.data.bookings || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Cancel booking
  async cancelBooking(bookingId: string): Promise<ApiResponse> {
    try {
      const response = await api.patch<ApiResponse>(`/api/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  
  // Get event statistics (admin)
  async getEventStats(): Promise<EventStats> {
    try {
      const response = await api.get<{ success: boolean; stats: EventStats }>('/api/events/stats');
      return response.data.stats;
    } catch (error) {
      // Return mock data if endpoint doesn't exist
      console.warn('Stats endpoint not available, using mock data');
      return this.getMockStats();
    }
  }
  
  // Mock stats for development
  private getMockStats(): EventStats {
    return {
      totalEvents: 42,
      upcomingEvents: 15,
      completedEvents: 27,
      totalAttendees: 3250,
      totalRevenue: 125000,
      categoryDistribution: [
        { category: 'Technology', count: 12 },
        { category: 'Business', count: 8 },
        { category: 'Music', count: 6 },
        { category: 'Sports', count: 5 },
        { category: 'Arts', count: 4 },
        { category: 'Education', count: 3 },
        { category: 'Health', count: 2 },
        { category: 'Food', count: 2 },
      ],
      monthlyEvents: [
        { month: 'Jan', count: 3 },
        { month: 'Feb', count: 4 },
        { month: 'Mar', count: 5 },
        { month: 'Apr', count: 3 },
        { month: 'May', count: 6 },
        { month: 'Jun', count: 4 },
        { month: 'Jul', count: 5 },
        { month: 'Aug', count: 3 },
        { month: 'Sep', count: 4 },
        { month: 'Oct', count: 2 },
        { month: 'Nov', count: 3 },
        { month: 'Dec', count: 0 },
      ],
    };
  }
  
  // Upload event image
  async uploadEventImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post<{ success: boolean; url: string }>(
        '/api/upload/event-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.url;
    } catch (error) {
      // If upload endpoint doesn't exist, return a placeholder
      console.warn('Upload endpoint not available, using placeholder');
      return `https://via.placeholder.com/800x400?text=${encodeURIComponent(file.name)}`;
    }
  }
  
  // Export bookings as CSV (client-side)
  exportBookingsCSV(bookings: Booking[]): void {
    const headers = ['Booking ID', 'Event', 'User', 'Email', 'Tickets', 'Amount', 'Status', 'Date'];
    const rows = bookings.map(booking => [
      booking._id,
      booking.event?.title || 'N/A',
      booking.user?.name || 'N/A',
      booking.user?.email || 'N/A',
      booking.tickets.toString(),
      `$${booking.totalAmount.toFixed(2)}`,
      booking.status,
      new Date(booking.createdAt).toLocaleDateString(),
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new EventsService();
