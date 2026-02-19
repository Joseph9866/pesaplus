/**
 * useErrorHandler Hook
 * Provides consistent error handling across the application
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIError } from '../types';
import {
  requiresAuthentication,
  isAuthorizationError,
  isRecoverableError,
  getErrorMessage,
} from '../lib/api/errorHandler';

interface UseErrorHandlerReturn {
  error: APIError | null;
  setError: (error: APIError | null) => void;
  handleError: (error: any) => void;
  clearError: () => void;
  isRecoverable: boolean;
}

/**
 * Hook for handling API errors with automatic navigation for auth errors
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<APIError | null>(null);
  const navigate = useNavigate();

  const handleError = useCallback(
    (err: any) => {
      // Convert to APIError if needed
      const apiError: APIError = err as APIError;

      // Handle authentication errors - redirect to login
      if (requiresAuthentication(apiError)) {
        console.error('Authentication required, redirecting to login');
        // Clear any stored tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login', { 
          state: { message: 'Your session has expired. Please log in again.' } 
        });
        return;
      }

      // Handle authorization errors - show error but don't redirect
      if (isAuthorizationError(apiError)) {
        console.error('Authorization error:', apiError.message);
        setError(apiError);
        return;
      }

      // For all other errors, just set the error state
      console.error('API error:', apiError);
      setError(apiError);
    },
    [navigate]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isRecoverable = error ? isRecoverableError(error) : false;

  return {
    error,
    setError,
    handleError,
    clearError,
    isRecoverable,
  };
};

export default useErrorHandler;
