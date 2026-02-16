/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient, { tokenManager } from '../client';
import { API_ENDPOINTS } from '../config';

export interface RegisterRequest {
  email: string;
  password1: string; // Django uses password1
  password2: string; // Password confirmation
  full_name: string;
  role: string; // User role (e.g., 'member', 'user', 'customer')
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
  };
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    full_name: string;
  };
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  date_joined: string;
}

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    console.log('Registering user with data:', { ...data, password: '[REDACTED]' });
    
    try {
      const response = await apiClient.post<RegisterResponse>(
        API_ENDPOINTS.auth.register,
        data
      );
      
      console.log('Registration successful:', response.data);
      
      // Store tokens
      tokenManager.setTokens(response.data.access, response.data.refresh);
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      data
    );
    
    // Store tokens
    tokenManager.setTokens(response.data.access, response.data.refresh);
    
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } finally {
      // Clear tokens regardless of API response
      tokenManager.clearTokens();
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>(
      API_ENDPOINTS.auth.user
    );
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await apiClient.post<{ access: string }>(
      API_ENDPOINTS.auth.tokenRefresh,
      { refresh: refreshToken }
    );
    return response.data;
  },

  /**
   * Verify token validity
   */
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      await apiClient.post(API_ENDPOINTS.auth.tokenVerify, { token });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Change password
   */
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.auth.passwordChange, {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.auth.passwordReset, { email });
  },

  /**
   * Confirm password reset
   */
  confirmPasswordReset: async (
    token: string,
    newPassword: string
  ): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.auth.passwordResetConfirm, {
      token,
      password: newPassword,
    });
  },
};
