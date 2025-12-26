import api, { handleApiError } from './api';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'organizer';
    phone?: string;
    department?: string;
    profileImage?: string;
    avatar?: string; // Base64 encoded profile image
    isVerified?: boolean;
    isActive?: boolean;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt?: string;
}

class UserService {
    // Get all users (admin only)
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await api.get<{ success: boolean; users: User[] }>('/api/users');
            return response.data.users || [];
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Get single user by ID
    async getUser(id: string): Promise<User> {
        try {
            const response = await api.get<{ success: boolean; user: User }>(`/api/users/${id}`);
            return response.data.user;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Update user
    async updateUser(id: string, data: Partial<User>): Promise<User> {
        try {
            const response = await api.put<{ success: boolean; user: User }>(`/api/users/${id}`, data);
            return response.data.user;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Delete user
    async deleteUser(id: string): Promise<void> {
        try {
            await api.delete(`/api/users/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Update user approval status (admin only)
    async updateApprovalStatus(
        userId: string,
        status: 'approved' | 'rejected'
    ): Promise<User> {
        try {
            const response = await api.patch<{ success: boolean; user: User }>(
                `/api/users/${userId}/approval`,
                { status }
            );
            return response.data.user;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Toggle user active status
    async toggleUserStatus(userId: string): Promise<User> {
        try {
            const response = await api.patch<{ success: boolean; user: User }>(
                `/api/users/${userId}/toggle-status`
            );
            return response.data.user;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export default new UserService();
