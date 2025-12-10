import { z } from 'zod';
import { VALIDATION } from './constants';

/**
 * Validation schemas for forms
 */

// Password validation with strength requirements
const passwordSchema = z
  .string()
  .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

// User registration schema
export const userRegisterSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`)
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be at most ${VALIDATION.NAME_MAX_LENGTH} characters`),
  email: z
    .string()
    .email('Invalid email address')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be at most ${VALIDATION.EMAIL_MAX_LENGTH} characters`),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// User login schema
export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Admin registration schema
export const adminRegisterSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`)
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be at most ${VALIDATION.NAME_MAX_LENGTH} characters`),
  email: z
    .string()
    .email('Invalid email address')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be at most ${VALIDATION.EMAIL_MAX_LENGTH} characters`),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Admin login schema
export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// OTP verification schema
export const otpSchema = z.object({
  otp: z
    .string()
    .length(VALIDATION.OTP_LENGTH, `OTP must be exactly ${VALIDATION.OTP_LENGTH} digits`)
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

// Event schema
export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be at most 1000 characters'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required').max(200, 'Location must be at most 200 characters'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Invalid image URL').optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1').optional(),
});

// Booking schema
export const bookingSchema = z.object({
  eventId: z.string().min(1, 'Event is required'),
  tickets: z.number().min(1, 'At least 1 ticket is required').max(10, 'Maximum 10 tickets allowed'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`)
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be at most ${VALIDATION.NAME_MAX_LENGTH} characters`),
  email: z
    .string()
    .email('Invalid email address')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be at most ${VALIDATION.EMAIL_MAX_LENGTH} characters`),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
});

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Email validation helper
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength calculator
export const calculatePasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;
  
  if (password.length >= VALIDATION.PASSWORD_MIN_LENGTH) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  
  if (score <= 2) return { score: 1, label: 'Weak', color: 'red' };
  if (score <= 4) return { score: 2, label: 'Fair', color: 'orange' };
  if (score <= 5) return { score: 3, label: 'Good', color: 'yellow' };
  return { score: 4, label: 'Strong', color: 'green' };
};

// Type exports
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type OTPInput = z.infer<typeof otpSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
