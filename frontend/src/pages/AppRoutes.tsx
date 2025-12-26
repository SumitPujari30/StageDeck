import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrivateRoute } from '@/components/guards/PrivateRoute';

// Lazy load pages for better performance
const LandingHome = lazy(() => import('./landing/LandingHome').then(m => ({ default: m.LandingHome })));
const UserLogin = lazy(() => import('./auth/user/UserLogin').then(m => ({ default: m.UserLogin })));
const UserRegister = lazy(() => import('./auth/user/UserRegister').then(m => ({ default: m.UserRegister })));
const UserVerifyOTP = lazy(() => import('./auth/user/UserVerifyOTP').then(m => ({ default: m.UserVerifyOTP })));
const AdminLogin = lazy(() => import('./auth/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminRegisterOTP = lazy(() => import('./auth/admin/AdminRegisterOTP').then(m => ({ default: m.AdminRegisterOTP })));
const AdminVerifyOTP = lazy(() => import('./auth/admin/AdminVerifyOTP').then(m => ({ default: m.AdminVerifyOTP })));

// User pages
const UserDashboard = lazy(() => import('./user/Dashboard').then(m => ({ default: m.Dashboard })));
const UserEvents = lazy(() => import('./user/Events').then(m => ({ default: m.Events })));
const UserEventDetails = lazy(() => import('./user/EventDetails').then(m => ({ default: m.EventDetails })));
const UserBookings = lazy(() => import('./user/Bookings').then(m => ({ default: m.Bookings })));
const UserProfile = lazy(() => import('./user/Profile').then(m => ({ default: m.Profile })));

// Admin pages
const AdminDashboard = lazy(() => import('./admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ManageEvents = lazy(() => import('./admin/ManageEvents').then(m => ({ default: m.ManageEvents })));
const ManageUsers = lazy(() => import('./admin/ManageUsers').then(m => ({ default: m.ManageUsers })));
const BookingsAdmin = lazy(() => import('./admin/BookingsAdmin').then(m => ({ default: m.BookingsAdmin })));
const Settings = lazy(() => import('./admin/Settings').then(m => ({ default: m.Settings })));

// 404 page
const NotFound = lazy(() => import('./NotFound').then(m => ({ default: m.NotFound })));

/**
 * Loading component
 */
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
  </div>
);

/**
 * Main application routes
 */
export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingHome />} />
        <Route path="/auth/user/login" element={<UserLogin />} />
        <Route path="/auth/user/register" element={<UserRegister />} />
        <Route path="/auth/user/verify-otp" element={<UserVerifyOTP />} />
        <Route path="/auth/admin/login" element={<AdminLogin />} />
        <Route path="/auth/admin/register" element={<AdminRegisterOTP />} />
        <Route path="/auth/admin/verify-otp" element={<AdminVerifyOTP />} />
        
        {/* Protected user routes */}
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="events" element={<UserEvents />} />
          <Route path="events/:id" element={<UserEventDetails />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        
        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requireAdmin>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="bookings" element={<BookingsAdmin />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
