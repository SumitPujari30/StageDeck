import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '@/services/auth.service';
import type { 
  UserLoginInput, 
  UserRegisterInput, 
  AdminLoginInput, 
  AdminRegisterInput 
} from '@/utils/validators';

/**
 * Authentication context for managing user state
 */

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (data: UserLoginInput) => Promise<void>;
  loginAdmin: (data: AdminLoginInput) => Promise<void>;
  register: (data: UserRegisterInput) => Promise<{ needsVerification: boolean; email?: string }>;
  registerAdmin: (data: AdminRegisterInput) => Promise<{ needsOTP: boolean }>;
  verifyAdminOTP: (email: string, otp: string) => Promise<void>;
  verifyUserOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        // Token might be invalid, clear it
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  const login = async (data: UserLoginInput) => {
    const response = await authService.loginUser(data);
    setUser(response.user);
  };
  
  const loginAdmin = async (data: AdminLoginInput) => {
    const response = await authService.loginAdmin(data);
    setUser(response.user);
  };
  
  const register = async (data: UserRegisterInput) => {
    const response = await authService.registerUser(data);
    // Check if OTP verification is needed
    if ((response as any).needsVerification) {
      return { needsVerification: true, email: (response as any).email || data.email };
    }
    setUser(response.user);
    return { needsVerification: false };
  };
  
  const registerAdmin = async (data: AdminRegisterInput) => {
    await authService.requestAdminOTP(data);
    // Store admin data temporarily for OTP verification
    sessionStorage.setItem('pendingAdminData', JSON.stringify(data));
    return { needsOTP: true };
  };
  
  const verifyAdminOTP = async (email: string, otp: string) => {
    const response = await authService.verifyAdminOTP(email, otp);
    if (response.verified) {
      // Get the pending admin data
      const pendingData = sessionStorage.getItem('pendingAdminData');
      if (pendingData) {
        const adminData = JSON.parse(pendingData) as AdminRegisterInput;
        // Now complete the registration
        const authResponse = await authService.registerAdmin(adminData);
        setUser(authResponse.user);
        sessionStorage.removeItem('pendingAdminData');
      }
    }
  };
  
  const verifyUserOTP = async (email: string, otp: string) => {
    const response = await authService.verifyUserOTP(email, otp);
    setUser(response.user);
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  
  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      logout();
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    // Update local storage with the correct key (USER_KEY = 'stagedeck_user')
    const token = authService.getToken();
    if (token) {
      localStorage.setItem('stagedeck_user', JSON.stringify(userData));
    }
  };
  
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    loginAdmin,
    register,
    registerAdmin,
    verifyAdminOTP,
    verifyUserOTP,
    logout,
    refreshUser,
    updateUser,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
