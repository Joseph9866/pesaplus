import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Currency type definition
export type Currency = 'KES' | 'USD';

// CurrencyContext interface
export interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: number;
}

// Create context with undefined default
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// LocalStorage key constant
const CURRENCY_STORAGE_KEY = 'currency-preference';

// Default exchange rate: 1 USD = 130 KES
const DEFAULT_EXCHANGE_RATE = 130;

// CurrencyProvider props
interface CurrencyProviderProps {
  children: ReactNode;
}

// CurrencyProvider component
export function CurrencyProvider({ children }: CurrencyProviderProps) {
  // Initialize currency from localStorage or default to 'KES'
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (stored === 'KES' || stored === 'USD') {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to read currency preference from localStorage:', error);
    }
    return 'KES';
  });

  // Persist currency changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch (error) {
      console.warn('Failed to save currency preference to localStorage:', error);
    }
  }, [currency]);

  // Wrapper function for setCurrency
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    exchangeRate: DEFAULT_EXCHANGE_RATE,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Custom hook to use currency context
export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
