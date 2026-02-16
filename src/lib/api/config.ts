/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

// Base API URL from environment variable or default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tj85nw4s-8000.uks1.devtunnels.ms';

// API version prefix
export const API_VERSION = '/api/v1';

// Full base URL for API calls
export const API_URL = `${API_BASE_URL}${API_VERSION}`;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    register: `${API_URL}/auth/register/`,
    login: `${API_URL}/auth/login/`,
    logout: `${API_URL}/auth/logout/`,
    tokenRefresh: `${API_URL}/auth/token/refresh/`,
    tokenVerify: `${API_URL}/auth/token/verify/`,
    user: `${API_URL}/auth/user/`,
    passwordChange: `${API_URL}/auth/password/change/`,
    passwordReset: `${API_URL}/auth/password/reset/`,
    passwordResetConfirm: `${API_URL}/auth/password/reset/confirm/`,
  },
  
  // Accounts
  accounts: {
    list: `${API_URL}/accounts/api/accounts/`,
    detail: (accountNumber: string) => `${API_URL}/accounts/api/accounts/${accountNumber}/`,
  },
  
  // KYC
  kyc: {
    list: `${API_URL}/accounts/api/kyc/`,
    detail: (membershipNumber: string) => `${API_URL}/accounts/api/kyc/${membershipNumber}/`,
  },
  
  // Next of Kin
  nextOfKin: {
    list: `${API_URL}/accounts/api/next-of-kins/`,
    detail: (id: number) => `${API_URL}/accounts/api/next-of-kins/${id}/`,
  },
  
  // Users
  users: {
    list: `${API_URL}/users/api/users/`,
    detail: (id: string) => `${API_URL}/users/api/users/${id}/`,
  },
} as const;

// Request timeout (30 seconds)
export const REQUEST_TIMEOUT = 30000;

// Token storage keys
export const TOKEN_KEYS = {
  access: 'access_token',
  refresh: 'refresh_token',
} as const;
