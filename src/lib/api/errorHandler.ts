/**
 * Error Handler Utility
 * Provides centralized error handling and user-friendly error messages
 */

import { APIError } from '../../types';

/**
 * Create a structured API error from axios error with user-friendly messages
 * Handles all error scenarios: network errors, authentication, validation, server errors, etc.
 */
export const createAPIError = (error: any): APIError => {
  const apiError = new Error() as APIError;
  
  if (error.response) {
    // Backend returned error response
    const { status, data } = error.response;
    
    // Handle different HTTP status codes with user-friendly messages
    switch (status) {
      case 400:
        // Validation errors
        apiError.message = data?.message || data?.detail || 'Please check your input and try again.';
        apiError.code = 'VALIDATION_ERROR';
        apiError.fieldErrors = data?.field_errors || data?.errors || data;
        break;
        
      case 401:
        // Authentication error
        apiError.message = 'Your session has expired. Please log in again.';
        apiError.code = 'AUTHENTICATION_ERROR';
        break;
        
      case 403:
        // Authorization error
        apiError.message = 'You do not have permission to perform this action.';
        apiError.code = 'AUTHORIZATION_ERROR';
        break;
        
      case 404:
        // Not found error
        apiError.message = 'The requested information could not be found.';
        apiError.code = 'NOT_FOUND';
        break;
        
      case 413:
        // Payload too large (file upload)
        apiError.message = 'File is too large. Please ensure files are under 5MB.';
        apiError.code = 'FILE_TOO_LARGE';
        break;
        
      case 415:
        // Unsupported media type
        apiError.message = 'Invalid file format. Please upload JPEG, PNG, or PDF files only.';
        apiError.code = 'INVALID_FILE_TYPE';
        break;
        
      case 429:
        // Too many requests
        apiError.message = 'Too many requests. Please wait a moment and try again.';
        apiError.code = 'RATE_LIMIT_EXCEEDED';
        break;
        
      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors
        apiError.message = 'Server error occurred. Please try again in a few moments.';
        apiError.code = 'SERVER_ERROR';
        break;
        
      default:
        // Generic error
        apiError.message = data?.message || data?.detail || 'An error occurred. Please try again.';
        apiError.code = data?.code || `HTTP_${status}`;
        apiError.fieldErrors = data?.field_errors || data?.errors;
    }
    
    apiError.status = status;
  } else if (error.request) {
    // Network error - no response received
    apiError.message = 'Unable to connect. Please check your internet connection and try again.';
    apiError.status = 0;
    apiError.code = 'NETWORK_ERROR';
  } else {
    // Other error (e.g., request setup error)
    apiError.message = error.message || 'An unexpected error occurred. Please try again.';
    apiError.status = 0;
    apiError.code = 'UNKNOWN_ERROR';
  }
  
  return apiError;
};

/**
 * Check if an error is recoverable (can be retried)
 * Recoverable errors include: network errors, timeouts, and 5xx server errors
 */
export const isRecoverableError = (error: APIError): boolean => {
  // Network errors are recoverable
  if (error.code === 'NETWORK_ERROR') {
    return true;
  }
  
  // Server errors (5xx) are recoverable
  if (error.status >= 500 && error.status < 600) {
    return true;
  }
  
  // Rate limit errors are recoverable after waiting
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    return true;
  }
  
  return false;
};

/**
 * Check if an error requires authentication (redirect to login)
 */
export const requiresAuthentication = (error: APIError): boolean => {
  return error.status === 401 || error.code === 'AUTHENTICATION_ERROR';
};

/**
 * Check if an error is an authorization error (access denied)
 */
export const isAuthorizationError = (error: APIError): boolean => {
  return error.status === 403 || error.code === 'AUTHORIZATION_ERROR';
};

/**
 * Check if an error is a validation error with field-specific errors
 */
export const isValidationError = (error: APIError): boolean => {
  return error.status === 400 || (error.code === 'VALIDATION_ERROR' && !!error.fieldErrors);
};

/**
 * Check if an error is a not found error
 */
export const isNotFoundError = (error: APIError): boolean => {
  return error.status === 404 || error.code === 'NOT_FOUND';
};

/**
 * Extract field-specific error messages from validation errors
 * Returns a map of field names to error messages
 */
export const extractFieldErrors = (error: APIError): Record<string, string> => {
  if (!error.fieldErrors) {
    return {};
  }
  
  const fieldErrors: Record<string, string> = {};
  
  for (const [field, errors] of Object.entries(error.fieldErrors)) {
    // If errors is an array, join them; otherwise use as-is
    if (Array.isArray(errors)) {
      fieldErrors[field] = errors.join(', ');
    } else if (typeof errors === 'string') {
      fieldErrors[field] = errors;
    } else {
      fieldErrors[field] = String(errors);
    }
  }
  
  return fieldErrors;
};

/**
 * Get a user-friendly error message for display
 * Falls back to generic message if no specific message is available
 */
export const getErrorMessage = (error: any): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};
