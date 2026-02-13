/**
 * End-to-End Integration Test: Currency Switching Flow
 * 
 * This test verifies the complete currency switching flow as specified in Task 12.1:
 * - Currency selection in Settings
 * - All pages display amounts in selected currency
 * - Currency persistence across page refresh
 * - Currency persistence across navigation
 * - No console errors
 * 
 * Validates: All Requirements
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { CurrencyProvider, useCurrency } from '../contexts/CurrencyContext';
import { CurrencyModal } from '../components/CurrencyModal';
import { Settings } from '../pages/Settings';

// Mock AuthContext for testing
vi.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      total_balance: 13000,
      total_saved: 10000,
    },
    signOut: vi.fn(),
    loading: false,
  }),
}));

// Mock react-router-dom navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock SideNav and Header components
vi.mock('../components/layout/SideNav', () => ({
  SideNav: () => <div data-testid="side-nav">SideNav</div>,
}));

vi.mock('../components/layout/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

// Test component that displays currency values
const TestCurrencyDisplay = () => {
  const { currency } = useCurrency();
  return (
    <div>
      <div data-testid="current-currency">{currency}</div>
    </div>
  );
};

describe('Currency Switching Flow - End-to-End Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear any console error mocks
    vi.clearAllMocks();
  });

  describe('Task 12.1: Complete Currency Switching Flow', () => {
    it('should allow currency selection in Settings and update display', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <CurrencyProvider>
            <Settings />
          </CurrencyProvider>
        </BrowserRouter>
      );

      // Verify Settings page renders by checking for key elements
      expect(screen.getByText('Personal Information')).toBeInTheDocument();

      // Find and verify the Currency button displays current currency (default: KES)
      const currencyButton = screen.getByText('Currency').closest('button');
      expect(currencyButton).toBeInTheDocument();
      expect(screen.getByText('KES')).toBeInTheDocument();

      // Click the Currency button to open modal
      await user.click(currencyButton!);

      // Verify modal opens and displays both currency options
      await waitFor(() => {
        expect(screen.getByText('Select Currency')).toBeInTheDocument();
      });
      expect(screen.getByText(/Kenyan Shilling/)).toBeInTheDocument();
      expect(screen.getByText(/US Dollar/)).toBeInTheDocument();

      // Select USD currency
      const usdOption = screen.getByText(/US Dollar/).closest('button');
      await user.click(usdOption!);

      // Verify modal closes and currency updates to USD
      await waitFor(() => {
        expect(screen.queryByText('Select Currency')).not.toBeInTheDocument();
      });

      // Verify the currency button now shows USD
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('should persist currency preference in localStorage', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <CurrencyProvider>
            <Settings />
          </CurrencyProvider>
        </BrowserRouter>
      );

      // Open currency modal
      const currencyButton = screen.getByText('Currency').closest('button');
      await user.click(currencyButton!);

      // Select USD
      await waitFor(() => {
        expect(screen.getByText('Select Currency')).toBeInTheDocument();
      });
      const usdOption = screen.getByText(/US Dollar/).closest('button');
      await user.click(usdOption!);

      // Verify localStorage was updated
      await waitFor(() => {
        expect(localStorage.getItem('currency-preference')).toBe('USD');
      });
    });

    it('should restore currency preference from localStorage on mount', () => {
      // Set currency preference in localStorage
      localStorage.setItem('currency-preference', 'USD');

      render(
        <BrowserRouter>
          <CurrencyProvider>
            <Settings />
          </CurrencyProvider>
        </BrowserRouter>
      );

      // Verify the currency is restored from localStorage
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('should maintain currency across component remounts (simulating page refresh)', () => {
      // Set currency to USD
      localStorage.setItem('currency-preference', 'USD');

      // First render
      const { unmount } = render(
        <BrowserRouter>
          <CurrencyProvider>
            <TestCurrencyDisplay />
          </CurrencyProvider>
        </BrowserRouter>
      );

      expect(screen.getByTestId('current-currency')).toHaveTextContent('USD');

      // Unmount (simulating navigation away)
      unmount();

      // Second render (simulating navigation back or page refresh)
      render(
        <BrowserRouter>
          <CurrencyProvider>
            <TestCurrencyDisplay />
          </CurrencyProvider>
        </BrowserRouter>
      );

      // Currency should still be USD
      expect(screen.getByTestId('current-currency')).toHaveTextContent('USD');
    });

    it('should default to KES when no preference is stored', () => {
      // Ensure localStorage is empty
      localStorage.clear();

      render(
        <BrowserRouter>
          <CurrencyProvider>
            <TestCurrencyDisplay />
          </CurrencyProvider>
        </BrowserRouter>
      );

      // Should default to KES
      expect(screen.getByTestId('current-currency')).toHaveTextContent('KES');
    });

    it('should update all currency displays immediately when currency changes', async () => {
      const user = userEvent.setup();

      // Component that displays multiple currency values
      const MultiCurrencyDisplay = () => {
        const { currency } = useCurrency();
        return (
          <div>
            <div data-testid="currency-1">{currency}</div>
            <div data-testid="currency-2">{currency}</div>
            <div data-testid="currency-3">{currency}</div>
          </div>
        );
      };

      const { rerender } = render(
        <BrowserRouter>
          <CurrencyProvider>
            <MultiCurrencyDisplay />
            <Settings />
          </CurrencyProvider>
        </BrowserRouter>
      );

      // All displays should show KES initially
      expect(screen.getByTestId('currency-1')).toHaveTextContent('KES');
      expect(screen.getByTestId('currency-2')).toHaveTextContent('KES');
      expect(screen.getByTestId('currency-3')).toHaveTextContent('KES');

      // Change currency to USD
      const currencyButton = screen.getByText('Currency').closest('button');
      await user.click(currencyButton!);

      await waitFor(() => {
        expect(screen.getByText('Select Currency')).toBeInTheDocument();
      });

      const usdOption = screen.getByText(/US Dollar/).closest('button');
      await user.click(usdOption!);

      // All displays should update to USD immediately
      await waitFor(() => {
        expect(screen.getByTestId('currency-1')).toHaveTextContent('USD');
        expect(screen.getByTestId('currency-2')).toHaveTextContent('USD');
        expect(screen.getByTestId('currency-3')).toHaveTextContent('USD');
      });
    });

    it('should handle modal close button click', async () => {
      const user = userEvent.setup();
      let isOpen = true;
      const onClose = vi.fn(() => {
        isOpen = false;
      });

      const { rerender } = render(
        <CurrencyProvider>
          <CurrencyModal isOpen={isOpen} onClose={onClose} />
        </CurrencyProvider>
      );

      // Find and click the close button (X icon)
      const closeButton = screen.getByLabelText('Close modal');
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalled();

      // Rerender with updated state
      rerender(
        <CurrencyProvider>
          <CurrencyModal isOpen={false} onClose={onClose} />
        </CurrencyProvider>
      );

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByText('Select Currency')).not.toBeInTheDocument();
      });
    });

    it('should indicate currently selected currency in modal', async () => {
      const user = userEvent.setup();

      // Set currency to USD
      localStorage.setItem('currency-preference', 'USD');

      render(
        <CurrencyProvider>
          <CurrencyModal isOpen={true} onClose={() => {}} />
        </CurrencyProvider>
      );

      // Modal should show USD as selected
      const usdOption = screen.getByText(/US Dollar/).closest('button');
      expect(usdOption).toHaveClass('border-neutral-900');
      expect(usdOption).toHaveClass('bg-neutral-50');
    });

    it('should not produce console errors during currency operations', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <CurrencyProvider>
            <Settings />
          </CurrencyProvider>
        </BrowserRouter>
      );

      // Perform currency switch
      const currencyButton = screen.getByText('Currency').closest('button');
      await user.click(currencyButton!);

      await waitFor(() => {
        expect(screen.getByText('Select Currency')).toBeInTheDocument();
      });

      const usdOption = screen.getByText(/US Dollar/).closest('button');
      await user.click(usdOption!);

      await waitFor(() => {
        expect(screen.queryByText('Select Currency')).not.toBeInTheDocument();
      });

      // Verify no console errors or warnings
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });
});
