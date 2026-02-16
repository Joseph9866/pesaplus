/**
 * Validation utility functions for form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates full name field
 * Requirements: 2.1 - Required field with minimum 2 characters
 * 
 * @param value - The full name to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export function validateFullName(value: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      error: 'Full name is required'
    };
  }

  if (value.trim().length < 2) {
    return {
      isValid: false,
      error: 'Full name must be at least 2 characters'
    };
  }

  return { isValid: true };
}

/**
 * Validates email field
 * Requirements: 2.2 - Required field with valid email format
 * 
 * @param value - The email to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export function validateEmail(value: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }

  // Email pattern: must contain @ symbol and domain
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(value)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return { isValid: true };
}

/**
 * Validates phone number field
 * Requirements: 2.3 - Optional field with valid phone format
 * 
 * @param value - The phone number to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export function validatePhoneNumber(value: string): ValidationResult {
  // Phone number is optional, so empty value is valid
  if (!value || value.trim().length === 0) {
    return { isValid: true };
  }

  // Phone pattern: supports international formats with optional +, parentheses, spaces, dots, and dashes
  // Allows flexible formatting with multiple digit groups
  const phonePattern = /^[+]?[(]?[0-9]+[)]?[-\s.]*[0-9]*[-\s.]*[0-9]*[-\s.]*[0-9]*$/;
  
  if (!phonePattern.test(value)) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number'
    };
  }

  return { isValid: true };
}
