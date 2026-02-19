/**
 * ErrorDisplay Component
 * Displays error messages with appropriate styling and retry options
 */

import React from 'react';
import { APIError } from '../../types';
import { isRecoverableError, extractFieldErrors } from '../../lib/api/errorHandler';

interface ErrorDisplayProps {
  error: APIError | Error | string | null;
  onRetry?: () => void;
  className?: string;
  showRetry?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  className = '',
  showRetry = true,
}) => {
  if (!error) return null;

  // Convert error to APIError if it's a string or generic Error
  const apiError: APIError = typeof error === 'string'
    ? { message: error, status: 0, code: 'UNKNOWN_ERROR' } as APIError
    : error as APIError;

  const message = apiError.message || 'An error occurred';
  const fieldErrors = apiError.fieldErrors ? extractFieldErrors(apiError) : {};
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  const canRetry = showRetry && onRetry && isRecoverableError(apiError);

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>
          
          {hasFieldErrors && (
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(fieldErrors).map(([field, errorMsg]) => (
                  <li key={field}>
                    <span className="font-medium capitalize">{field.replace(/_/g, ' ')}:</span> {errorMsg}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {canRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
