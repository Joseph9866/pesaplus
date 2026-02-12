# Mock Data Layer - Quick Start Guide

## 🎭 What is this?

The mock data layer lets you test your app with realistic dummy data without needing a database. Perfect for frontend development!

## 🚀 Getting Started

Your app is now configured to use mock data. Just start the dev server:

```bash
npm run dev
```

## 🔑 Test Credentials

Use these credentials to log in:

### New User (Empty Account)
- **Email:** `new-user@test.com`
- **Password:** `password123`
- Fresh account with no goals or transactions

### Active User (Some Activity)
- **Email:** `active-user@test.com`
- **Password:** `password123`
- Has 3 active goals, transactions, and challenge participation

### Power User (Lots of Activity)
- **Email:** `power-user@test.com`
- **Password:** `password123`
- Has 5 goals (3 active, 2 completed), 25+ transactions, referrals, and lottery entries

## ⚙️ Configuration

Edit `.env` to customize mock behavior:

```env
# Enable/disable mock mode
VITE_USE_MOCK_DATA=true

# Simulate network delay (milliseconds)
VITE_MOCK_API_DELAY_MIN=300
VITE_MOCK_API_DELAY_MAX=800

# Simulate random errors (0.0 to 1.0)
VITE_MOCK_ERROR_RATE=0
```

## 🔄 Switching to Real Database

When your backend is ready, just change one line in `.env`:

```env
VITE_USE_MOCK_DATA=false
```

No code changes needed! Your components will automatically use the real Supabase client.

## 📝 What's Included

The mock layer provides realistic data for:
- ✅ User profiles with KYC status
- ✅ Goals with progress tracking
- ✅ Transactions (deposits, withdrawals)
- ✅ Challenges and participation
- ✅ Referrals and lottery entries
- ✅ Notifications

## 🎯 Features

- **In-Memory Storage:** Changes persist during your session
- **Realistic Delays:** Simulates network latency
- **Full CRUD:** Create, read, update, delete operations
- **Query Support:** Filtering, sorting, limiting
- **Auth Flow:** Sign up, sign in, sign out
- **Console Logging:** See all operations in dev tools

## 🔍 Debugging

Open your browser console to see mock data operations:

```
🎭 Mock Data Mode Active
📝 Test Credentials:
  - new-user: new-user@test.com / password123
  - active-user: active-user@test.com / password123
  - power-user: power-user@test.com / password123

[MockAuthProvider] SIGN_IN: { email: 'active-user@test.com' }
[MockDataProvider] SELECT: { table: 'user_profiles', count: 1 }
```

## 💡 Tips

1. **Reload to Reset:** Refresh the page to reset mock data to initial state
2. **Test Different Scenarios:** Try all three test accounts to see different UI states
3. **Adjust Delays:** Set delays to 0 for instant responses during development
4. **No Backend Needed:** Develop and test without waiting for backend APIs

## 🎉 You're Ready!

Start your dev server and log in with any test account. Everything works without a database!
