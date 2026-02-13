import { useCurrency } from '../contexts/CurrencyContext';

export type Currency = 'KES' | 'USD';

/**
 * Converts a monetary amount from one currency to another.
 * 
 * @param amount - The amount to convert
 * @param fromCurrency - The source currency
 * @param toCurrency - The target currency
 * @param exchangeRate - The exchange rate (KES per 1 USD)
 * @returns The converted amount with appropriate rounding
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: number
): number {
  // No conversion needed if currencies are the same
  if (fromCurrency === toCurrency) {
    return amount;
  }

  let convertedAmount: number;

  // Convert KES to USD: divide by exchange rate
  if (fromCurrency === 'KES' && toCurrency === 'USD') {
    convertedAmount = amount / exchangeRate;
    // Round to 2 decimal places for USD
    return Math.round(convertedAmount * 100) / 100;
  }

  // Convert USD to KES: multiply by exchange rate
  if (fromCurrency === 'USD' && toCurrency === 'KES') {
    convertedAmount = amount * exchangeRate;
    // Round to 0 decimal places for KES
    return Math.round(convertedAmount);
  }

  // This should never happen with proper TypeScript types
  return amount;
}

/**
 * Formats a monetary amount with the appropriate currency symbol and formatting.
 * 
 * @param amount - The amount to format
 * @param currency - The currency to format as ('KES' or 'USD')
 * @returns The formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: Currency
): string {
  if (currency === 'KES') {
    // KES: "KSh" prefix, 0 decimals, thousand separators
    const formatted = new Intl.NumberFormat('en-KE', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `KSh ${formatted}`;
  }

  if (currency === 'USD') {
    // USD: "$" prefix, 2 decimals, thousand separators
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // Fallback (should never happen with proper TypeScript types)
  return amount.toString();
}

/**
 * Custom hook that combines currency conversion and formatting.
 * Automatically converts the base amount to the user's current currency preference
 * and returns a formatted string ready for display.
 * 
 * @param baseAmount - The amount in the base currency
 * @param baseCurrency - The currency of the base amount (defaults to 'KES')
 * @returns A formatted currency string in the user's preferred currency
 * 
 * @example
 * // If user's currency is USD:
 * useFormattedCurrency(13000, 'KES') // Returns "$100.00"
 * 
 * // If user's currency is KES:
 * useFormattedCurrency(13000, 'KES') // Returns "KSh 13,000"
 */
export function useFormattedCurrency(
  baseAmount: number,
  baseCurrency: Currency = 'KES'
): string {
  const { currency, exchangeRate } = useCurrency();
  
  // Convert from base currency to user's current currency
  const convertedAmount = convertCurrency(
    baseAmount,
    baseCurrency,
    currency,
    exchangeRate
  );
  
  // Format the converted amount with appropriate currency symbol
  return formatCurrency(convertedAmount, currency);
}
