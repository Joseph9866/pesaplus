/**
 * Example usage of useFormattedCurrency hook
 * 
 * This file demonstrates how to use the useFormattedCurrency hook
 * in React components to display monetary values with automatic
 * currency conversion and formatting.
 */

import { useFormattedCurrency } from '../currency';

// Example 1: Basic usage in a component
export function BalanceDisplay() {
  // Assuming balance is stored in KES (base currency)
  const balance = 13000;
  
  // Hook automatically converts to user's preferred currency
  const formattedBalance = useFormattedCurrency(balance, 'KES');
  
  return (
    <div>
      <h2>Your Balance</h2>
      <p>{formattedBalance}</p>
      {/* 
        If user's currency is KES: displays "KSh 13,000"
        If user's currency is USD: displays "$100.00"
      */}
    </div>
  );
}

// Example 2: Using with USD base amounts
export function RewardDisplay() {
  const rewardAmount = 50; // Amount in USD
  
  const formattedReward = useFormattedCurrency(rewardAmount, 'USD');
  
  return (
    <div>
      <h3>Reward</h3>
      <p>{formattedReward}</p>
      {/* 
        If user's currency is USD: displays "$50.00"
        If user's currency is KES: displays "KSh 6,500"
      */}
    </div>
  );
}

// Example 3: Default base currency (KES)
export function GoalCard() {
  const targetAmount = 50000; // Stored in KES
  
  // baseCurrency defaults to 'KES' if not specified
  const formattedTarget = useFormattedCurrency(targetAmount);
  
  return (
    <div>
      <h3>Goal Target</h3>
      <p>{formattedTarget}</p>
      {/* 
        If user's currency is KES: displays "KSh 50,000"
        If user's currency is USD: displays "$384.62"
      */}
    </div>
  );
}

// Example 4: Multiple amounts in the same component
export function TransactionItem() {
  const amount = 2600;
  const fee = 50;
  const total = amount + fee;
  
  const formattedAmount = useFormattedCurrency(amount);
  const formattedFee = useFormattedCurrency(fee);
  const formattedTotal = useFormattedCurrency(total);
  
  return (
    <div>
      <p>Amount: {formattedAmount}</p>
      <p>Fee: {formattedFee}</p>
      <p>Total: {formattedTotal}</p>
      {/* All amounts automatically convert to user's preferred currency */}
    </div>
  );
}
