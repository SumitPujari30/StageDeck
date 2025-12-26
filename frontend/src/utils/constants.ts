/**
 * Application constants
 */

// API Configuration
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
// Remove trailing slash and /api to prevent double prefixes
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '').replace(/\/api$/, '');
export const API_TIMEOUT = 30000; // 30 seconds

// Admin Configuration
export const ADMIN_CONFIRM_EMAIL = import.meta.env.VITE_ADMIN_CONFIRM_EMAIL || 'admin-confirm@stagedeck.test';

// Auth Configuration
export const TOKEN_KEY = 'stagedeck_token';
export const REFRESH_TOKEN_KEY = 'stagedeck_refresh_token';
export const USER_KEY = 'stagedeck_user';

// Routes
export const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',
  FEATURES: '/features',
  PUBLIC_EVENTS: '/events',
  PUBLIC_EVENT_DETAIL: '/events/:id',

  // Auth routes
  USER_REGISTER: '/auth/user/register',
  USER_LOGIN: '/auth/user/login',
  ADMIN_REGISTER: '/auth/admin/register',
  ADMIN_LOGIN: '/auth/admin/login',

  // User routes
  USER_DASHBOARD: '/user/dashboard',
  USER_EVENTS: '/user/events',
  USER_EVENT_DETAIL: '/user/events/:id',
  USER_BOOKINGS: '/user/bookings',
  USER_PROFILE: '/user/profile',

  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_USERS: '/admin/users',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// Event Categories
export const EVENT_CATEGORIES = [
  'Technology',
  'Business',
  'Music',
  'Sports',
  'Arts',
  'Education',
  'Health',
  'Food',
  'Travel',
  'Other',
] as const;

// Event Status
export const EVENT_STATUS = {
  SCHEDULED: 'Scheduled',
  DRAFT: 'Draft',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const TIME_FORMAT = 'hh:mm a';
export const DATETIME_FORMAT = 'MMM dd, yyyy hh:mm a';

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 12,
  OTP_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
} as const;

// Toast Duration
export const TOAST_DURATION = 5000; // 5 seconds

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Chart Colors
export const CHART_COLORS = {
  primary: '#a855f7',
  secondary: '#ec4899',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
} as const;
