import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Route guard for authenticated users
 */

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to appropriate login page
    const loginPath = requireAdmin ? '/auth/admin/login' : '/auth/user/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    // User is authenticated but not an admin
    return <Navigate to="/user/dashboard" replace />;
  }
  
  return <>{children}</>;
};
