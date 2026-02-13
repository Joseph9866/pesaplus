import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useCurrency, Currency } from '../contexts/CurrencyContext';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencyModal = ({ isOpen, onClose }: CurrencyModalProps) => {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencySelect = (selectedCurrency: Currency) => {
    setCurrency(selectedCurrency);
    onClose();
  };

  const currencies = [
    { code: 'KES' as Currency, name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'USD' as Currency, name: 'US Dollar', symbol: '$' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Modal Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-2xl shadow-xl w-full relative"
              style={{ maxWidth: '400px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                <h2 className="text-xl font-semibold text-neutral-900">Select Currency</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-neutral-600" />
                </button>
              </div>

              {/* Currency Options */}
              <div className="p-6">
                <div className="space-y-3">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => handleCurrencySelect(curr.code)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        currency === curr.code
                          ? 'border-neutral-900 bg-neutral-50'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                            currency === curr.code
                              ? 'border-neutral-900 bg-neutral-900'
                              : 'border-neutral-300'
                          }`}
                        >
                          {currency === curr.code && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-semibold text-neutral-900">
                            {curr.code}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {curr.name} ({curr.symbol})
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
