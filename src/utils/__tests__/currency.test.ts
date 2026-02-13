import { describe, it, expect } from 'vitest';
import { convertCurrency, formatCurrency } from '../currency';

describe('convertCurrency', () => {
  const EXCHANGE_RATE = 130; // 1 USD = 130 KES

  describe('same currency conversion', () => {
    it('should return the same amount when converting KES to KES', () => {
      expect(convertCurrency(13000, 'KES', 'KES', EXCHANGE_RATE)).toBe(13000);
    });

    it('should return the same amount when converting USD to USD', () => {
      expect(convertCurrency(100, 'USD', 'USD', EXCHANGE_RATE)).toBe(100);
    });
  });

  describe('KES to USD conversion', () => {
    it('should convert KES to USD by dividing by exchange rate', () => {
      expect(convertCurrency(13000, 'KES', 'USD', EXCHANGE_RATE)).toBe(100);
    });

    it('should round USD to 2 decimal places', () => {
      expect(convertCurrency(13333, 'KES', 'USD', EXCHANGE_RATE)).toBe(102.56);
    });

    it('should handle small amounts', () => {
      expect(convertCurrency(130, 'KES', 'USD', EXCHANGE_RATE)).toBe(1);
    });

    it('should handle zero amount', () => {
      expect(convertCurrency(0, 'KES', 'USD', EXCHANGE_RATE)).toBe(0);
    });
  });

  describe('USD to KES conversion', () => {
    it('should convert USD to KES by multiplying by exchange rate', () => {
      expect(convertCurrency(100, 'USD', 'KES', EXCHANGE_RATE)).toBe(13000);
    });

    it('should round KES to 0 decimal places', () => {
      expect(convertCurrency(100.75, 'USD', 'KES', EXCHANGE_RATE)).toBe(13098);
    });

    it('should handle small amounts', () => {
      expect(convertCurrency(1, 'USD', 'KES', EXCHANGE_RATE)).toBe(130);
    });

    it('should handle zero amount', () => {
      expect(convertCurrency(0, 'USD', 'KES', EXCHANGE_RATE)).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle fractional KES amounts', () => {
      const result = convertCurrency(13050.50, 'KES', 'USD', EXCHANGE_RATE);
      expect(result).toBe(100.39);
    });

    it('should handle large amounts', () => {
      const result = convertCurrency(1000000, 'KES', 'USD', EXCHANGE_RATE);
      expect(result).toBe(7692.31);
    });
  });
});

describe('formatCurrency', () => {
  it('should format KES with KSh prefix and no decimals', () => {
    expect(formatCurrency(13000, 'KES')).toBe('KSh 13,000');
  });

  it('should format USD with $ prefix and 2 decimals', () => {
    expect(formatCurrency(100, 'USD')).toBe('$100.00');
  });

  it('should format KES with thousand separators', () => {
    expect(formatCurrency(1000000, 'KES')).toBe('KSh 1,000,000');
  });

  it('should format USD with thousand separators', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
  });

  it('should handle zero amounts', () => {
    expect(formatCurrency(0, 'KES')).toBe('KSh 0');
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });
});
