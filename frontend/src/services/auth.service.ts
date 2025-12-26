import api, { ApiResponse, handleApiError } from './api';
import { TOKEN_KEY, USER_KEY, ADMIN_CONFIRM_EMAIL } from '@/utils/constants';
import type {
  UserLoginInput,
  UserRegisterInput,
  AdminLoginInput,
  AdminRegisterInput,

} from '@/utils/validators';

/**
 * Authentication service
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  department?: string;
  phone?: string;
  interests?: string[];
  profileImage?: string;
  avatar?: string; // Base64 encoded profile image
  approvalStatus?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  verified?: boolean;
  token?: string;
  user?: User;
}

class AuthService {
  // User authentication
  async registerUser(data: UserRegisterInput): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async loginUser(data: UserLoginInput): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', data);

      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Admin authentication
  async requestAdminOTP(data: Partial<AdminRegisterInput>): Promise<OTPResponse> {
    try {
      // Use the hardcoded admin confirmation email
      const response = await api.post<OTPResponse>('/api/auth/admin/request-otp', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async verifyAdminOTP(email: string, otp: string): Promise<OTPResponse> {
    try {
      const response = await api.post<OTPResponse>('/api/auth/admin/verify-otp', {
        email,
        otp,
      });

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async registerAdmin(data: AdminRegisterInput): Promise<AuthResponse> {
    try {
      // First request OTP
      await this.requestAdminOTP(data);

      // Note: In a real flow, we'd wait for OTP verification
      // For now, we'll just return a message
      return {
        success: true,
        token: '',
        user: {
          id: '',
          name: data.name,
          email: data.email,
          role: 'admin',
        },
      };
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async loginAdmin(data: AdminLoginInput): Promise<AuthResponse> {
    try {
      // Admin login uses the same endpoint but we might want to verify role
      const response = await api.post<AuthResponse>('/api/auth/login', data);

      // Verify that the user is an admin
      if (response.data.user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Password reset
  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async verifyOTP(email: string, otp: string): Promise<OTPResponse> {
    try {
      const response = await api.post<OTPResponse>('/api/auth/verify-otp', {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async resetPassword(email: string, password: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/api/auth/reset-password', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // User OTP verification
  async verifyUserOTP(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/verify-user-otp', {
        email,
        otp,
      });

      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async resendUserOTP(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/api/auth/register', {
        email,
        // Send only email to trigger OTP resend for existing unverified user
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }


  // Get current user
  async getCurrentUser(): Promise<User> {
    // For now, just return the user from localStorage
    // In a real app, you might want to verify the token with the backend
    const user = this.getUser();
    if (!user) {
      throw new Error('No user found');
    }
    return user;

    // TODO: Uncomment when backend /api/auth/me endpoint is ready
    // try {
    //   const response = await api.get<{ success: boolean; user: User }>('/api/auth/me');
    //   return response.data.user;
    // } catch (error) {
    //   throw new Error(handleApiError(error));
    // }
  }

  // Update user profile
  async updateProfile(data: Partial<Omit<User, 'avatar'>> & { avatar?: File }): Promise<User> {
    try {
      let avatarUrl = data.avatar ? await this.uploadImage(data.avatar) : undefined;

      // In a real app, we would send the data to the backend
      // const response = await api.put<{ success: boolean; user: User }>('/api/users/profile', {
      //   ...data,
      //   avatar: avatarUrl
      // });
      // const updatedUser = response.data.user;

      // Mock update
      const currentUser = this.getUser();
      if (!currentUser) throw new Error('User not found');

      const updatedUser = {
        ...currentUser,
        ...data,
        avatar: avatarUrl || currentUser.avatar
      };

      this.setAuthData(this.getToken() || '', updatedUser);
      return updatedUser;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Upload image
  async uploadImage(file: File): Promise<string> {
    try {
      // TODO: Connect to backend upload endpoint
      // const formData = new FormData();
      // formData.append('image', file);
      // const response = await api.post<{ url: string }>('/api/upload', formData);
      // return response.data.url;

      // Mock upload - convert to base64 for local storage demo
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/';
  }

  // Helper methods
  private setAuthData(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  getAdminConfirmEmail(): string {
    return ADMIN_CONFIRM_EMAIL;
  }
}

export default new AuthService();
