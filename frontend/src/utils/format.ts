import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT } from './constants';

/**
 * Formatting utilities
 */

// Format date
export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, DATE_FORMAT);
  } catch {
    return 'Invalid date';
  }
};

// Format time
export const formatTime = (time: string): string => {
  try {
    // If time is already in the correct format, return it
    if (/^\d{1,2}:\d{2}\s?(AM|PM|am|pm)$/i.test(time)) {
      return time;
    }
    // Otherwise, try to parse and format it
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  } catch {
    return time;
  }
};

// Format datetime
export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, DATETIME_FORMAT);
  } catch {
    return 'Invalid date';
  }
};

// Format relative time
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

// Format currency
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Format percentage
export const formatPercentage = (value: number, decimals = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Truncate text
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Return original if not a standard US number
  return phone;
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Convert to slug
export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format event status
export const formatEventStatus = (status: string): {
  label: string;
  color: string;
} => {
  const statusMap: Record<string, { label: string; color: string }> = {
    Scheduled: { label: 'Scheduled', color: 'blue' },
    Draft: { label: 'Draft', color: 'gray' },
    Cancelled: { label: 'Cancelled', color: 'red' },
    Completed: { label: 'Completed', color: 'green' },
  };
  
  return statusMap[status] || { label: status, color: 'gray' };
};

// Format booking status
export const formatBookingStatus = (status: string): {
  label: string;
  color: string;
} => {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'yellow' },
    confirmed: { label: 'Confirmed', color: 'green' },
    cancelled: { label: 'Cancelled', color: 'red' },
    completed: { label: 'Completed', color: 'blue' },
  };
  
  return statusMap[status.toLowerCase()] || { label: status, color: 'gray' };
};
