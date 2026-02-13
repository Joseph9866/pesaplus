# Manual Testing Checklist - Currency Switching Flow

This checklist verifies Task 12.1: Complete currency switching flow across the application.

## Prerequisites
- Application is running (`npm run dev`)
- User is logged in
- Browser console is open (F12) to check for errors

## Test 1: Currency Selection in Settings

### Steps:
1. Navigate to Settings page (from side menu or profile)
2. Locate the "Currency" option in the Preferences section
3. Verify it displays the current currency (default: KES)
4. Click on the Currency option

### Expected Results:
- ✅ Currency modal opens
- ✅ Modal displays "Select Currency" title
- ✅ Both KES and USD options are visible
- ✅ Current currency (KES) is highlighted/selected
- ✅ No console errors

## Test 2: Currency Selection and Update

### Steps:
1. With the currency modal open, click on USD option
2. Observe the modal behavior
3. Check the Settings page Currency option

### Expected Results:
- ✅ Modal closes automatically after selection
- ✅ Currency option in Settings now shows "USD"
- ✅ No console errors

## Test 3: Currency Display Across Pages

### Steps:
1. With USD selected, navigate to each page and verify amounts:
   - **Dashboard**: Check balance card, total saved, available balance
   - **Goals**: Check goal target amounts, current amounts, progress
   - **Goal Detail**: Check target, current, remaining amounts, transaction history
   - **Rewards**: Check leaderboard amounts, prize amounts
   - **Social**: Check challenge amounts, referral rewards

### Expected Results:
- ✅ All monetary values display with "$" symbol
- ✅ All amounts show 2 decimal places (e.g., $100.00)
- ✅ Amounts are correctly converted (KES ÷ 130 = USD)
- ✅ No "KSh" symbols visible anywhere
- ✅ No console errors

## Test 4: Switch Back to KES

### Steps:
1. Return to Settings page
2. Click Currency option
3. Select KES
4. Navigate through the same pages as Test 3

### Expected Results:
- ✅ All monetary values display with "KSh" symbol
- ✅ All amounts show 0 decimal places (e.g., KSh 13,000)
- ✅ Amounts are correctly converted back (USD × 130 = KES)
- ✅ No "$" symbols visible anywhere
- ✅ No console errors

## Test 5: Currency Persistence Across Page Refresh

### Steps:
1. Select USD currency in Settings
2. Navigate to Dashboard
3. Verify amounts are in USD
4. Refresh the browser page (F5 or Ctrl+R)
5. Check the Dashboard amounts again

### Expected Results:
- ✅ Currency remains USD after refresh
- ✅ All amounts still display in USD with "$" symbol
- ✅ No flash of KES amounts before switching to USD
- ✅ No console errors

## Test 6: Currency Persistence Across Navigation

### Steps:
1. Select USD currency in Settings
2. Navigate to Dashboard → Goals → Goal Detail → Rewards → Social → Settings
3. Verify currency display at each step

### Expected Results:
- ✅ Currency remains USD throughout navigation
- ✅ All pages consistently show amounts in USD
- ✅ Settings page shows "USD" in Currency option
- ✅ No console errors

## Test 7: Large Numbers and Formatting

### Steps:
1. Find or create a goal with a large target amount (e.g., 1,000,000 KES)
2. Switch between KES and USD
3. Verify formatting

### Expected Results:
- ✅ KES: "KSh 1,000,000" (with thousand separators, no decimals)
- ✅ USD: "$7,692.31" (with thousand separators, 2 decimals)
- ✅ Thousand separators (commas) are present
- ✅ No console errors

## Test 8: Zero and Small Amounts

### Steps:
1. Find or create a goal with 0 or small amounts
2. Switch between currencies
3. Verify formatting

### Expected Results:
- ✅ Zero amounts: "KSh 0" or "$0.00"
- ✅ Small amounts formatted correctly (e.g., KSh 130 = $1.00)
- ✅ No "NaN" or "undefined" displayed
- ✅ No console errors

## Test 9: Modal Interaction

### Steps:
1. Open currency modal
2. Click the X (close) button
3. Open modal again
4. Click outside the modal (on backdrop)
5. Open modal again
6. Press Escape key (if implemented)

### Expected Results:
- ✅ Modal closes when clicking X button
- ✅ Modal closes when clicking backdrop
- ✅ Modal can be reopened multiple times
- ✅ No console errors

## Test 10: Console Error Check

### Steps:
1. Open browser console (F12)
2. Clear console
3. Perform a complete currency switch flow:
   - Open Settings
   - Open currency modal
   - Switch to USD
   - Navigate to 3-4 different pages
   - Switch back to KES
   - Navigate to 3-4 different pages

### Expected Results:
- ✅ No errors in console
- ✅ No warnings in console (except expected React warnings)
- ✅ No failed network requests related to currency

## Test 11: Default Currency Behavior

### Steps:
1. Open browser DevTools → Application → Local Storage
2. Delete the "currency-preference" key
3. Refresh the page
4. Check Settings page

### Expected Results:
- ✅ Currency defaults to KES
- ✅ All amounts display in KES
- ✅ Settings shows "KES" in Currency option
- ✅ No console errors

## Summary

**Total Tests**: 11  
**Passed**: ___  
**Failed**: ___  

### Issues Found:
(List any issues discovered during manual testing)

---

### Notes:
- All automated tests are passing (32/32)
- Exchange rate used: 1 USD = 130 KES
- Currency preference stored in localStorage with key: "currency-preference"

### Tested By:
- Name: _______________
- Date: _______________
- Browser: _______________
- Version: _______________
