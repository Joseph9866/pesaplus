import { describe, it, expect } from 'vitest';
import { validateFullName, validateEmail, validatePhoneNumber } from '../validation';

describe('validateFullName', () => {
  describe('required field validation', () => {
    it('should return error for empty string', () => {
      const result = validateFullName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name is required');
    });

    it('should return error for whitespace-only string', () => {
      const result = validateFullName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name is required');
    });
  });

  describe('minimum length validation', () => {
    it('should return error for single character', () => {
      const result = validateFullName('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name must be at least 2 characters');
    });

    it('should accept exactly 2 characters', () => {
      const result = validateFullName('AB');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept names longer than 2 characters', () => {
      const result = validateFullName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('whitespace handling', () => {
    it('should trim whitespace before validation', () => {
      const result = validateFullName('  John Doe  ');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return error if trimmed length is less than 2', () => {
      const result = validateFullName('  A  ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Full name must be at least 2 characters');
    });
  });
});

describe('validateEmail', () => {
  describe('required field validation', () => {
    it('should return error for empty string', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should return error for whitespace-only string', () => {
      const result = validateEmail('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });
  });

  describe('email format validation', () => {
    it('should return error for email without @ symbol', () => {
      const result = validateEmail('invalidemail.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should return error for email without domain', () => {
      const result = validateEmail('user@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should return error for email without local part', () => {
      const result = validateEmail('@domain.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should return error for email without TLD', () => {
      const result = validateEmail('user@domain');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should accept valid email format', () => {
      const result = validateEmail('user@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept email with subdomain', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept email with plus sign', () => {
      const result = validateEmail('user+tag@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept email with dots in local part', () => {
      const result = validateEmail('first.last@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});

describe('validatePhoneNumber', () => {
  describe('optional field validation', () => {
    it('should accept empty string (optional field)', () => {
      const result = validatePhoneNumber('');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept whitespace-only string (optional field)', () => {
      const result = validatePhoneNumber('   ');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('phone format validation', () => {
    it('should accept basic phone number', () => {
      const result = validatePhoneNumber('1234567890');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept phone number with country code', () => {
      const result = validatePhoneNumber('+254712345678');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept phone number with spaces', () => {
      const result = validatePhoneNumber('+254 712 345 678');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept phone number with dashes', () => {
      const result = validatePhoneNumber('123-456-7890');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept phone number with dots', () => {
      const result = validatePhoneNumber('123.456.7890');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept phone number with parentheses', () => {
      const result = validatePhoneNumber('(123) 456-7890');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return error for phone with letters', () => {
      const result = validatePhoneNumber('123-ABC-7890');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid phone number');
    });

    it('should return error for phone with special characters', () => {
      const result = validatePhoneNumber('123@456#7890');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid phone number');
    });
  });
});
