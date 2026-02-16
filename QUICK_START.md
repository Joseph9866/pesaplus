# Quick Start - Testing Backend Integration

## 🎯 What's Been Done

Your Django backend is now integrated with the frontend! The authentication system (login/signup) can work with either:
- **Mock data** (for testing without backend)
- **Real Django API** (for production)

## 🧪 Test the Integration

### Option 1: Test with Mock Data (Current Setup)

The app is currently in mock mode. Just run:

```bash
npm run dev
```

Then login with:
- Email: `active-user@test.com`
- Password: `password123`

### Option 2: Test with Real Backend

1. **Make sure your Django backend is running** at:
   ```
   https://tj85nw4s-8000.uks1.devtunnels.ms
   ```

2. **Switch to real API mode** by editing `.env`:
   ```env
   VITE_USE_MOCK_DATA=false
   ```

3. **Restart the dev server**:
   ```bash
   npm run dev
   ```

4. **Test the flow**:
   - Go to Signup page
   - Create a new account
   - You should be logged in automatically
   - Check browser DevTools → Network tab to see API calls

## 🔍 Verify It's Working

### In Mock Mode:
- Login page shows "Mock Mode - Test Credentials" banner
- No network calls to Django backend
- Uses local Supabase mock data

### In Real API Mode:
- No mock mode banner
- Network tab shows calls to `https://tj85nw4s-8000.uks1.devtunnels.ms/api/v1/auth/`
- JWT tokens stored in localStorage
- Real user data from Django backend

## 🛠️ Check Network Calls

Open browser DevTools (F12) → Network tab:

### Expected API Calls:

**On Login:**
```
POST /api/v1/auth/login/
Request: { email, password }
Response: { access, refresh, user }
```

**On Signup:**
```
POST /api/v1/auth/register/
Request: { email, password, full_name }
Response: { access, refresh, user }
```

**On Page Load (if logged in):**
```
GET /api/v1/auth/user/
Headers: Authorization: Bearer <token>
Response: { id, email, full_name, ... }
```

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution:** Backend needs to allow your frontend origin in CORS settings

### Issue: 401 Unauthorized
**Solution:** Check if tokens are being stored in localStorage (DevTools → Application → Local Storage)

### Issue: Network Error
**Solution:** Verify backend URL is correct and backend is running

### Issue: Token Refresh Loop
**Solution:** Check backend token refresh endpoint is working

## 📱 What Works Now

✅ User Registration (Signup)
✅ User Login
✅ User Logout
✅ Automatic token refresh
✅ Session persistence
✅ Protected routes

## 🚧 What's Next

The following still use mock data and need integration:
- Dashboard (goals, balance, transactions)
- Goals management
- KYC submission
- Rewards/Lottery
- Social features
- Profile updates

## 📚 Documentation

For detailed information, see:
- `BACKEND_INTEGRATION.md` - Complete integration guide
- `INTEGRATION_SUMMARY.md` - What's been implemented
- `MOCK_DATA_README.md` - Mock data system

## 💡 Tips

1. **Keep mock mode enabled** during frontend development
2. **Switch to real API** when testing backend integration
3. **Check Network tab** to debug API issues
4. **Clear localStorage** if you get stuck with old tokens

## 🎉 You're Ready!

The authentication system is fully integrated. You can now:
1. Test with mock data (no backend needed)
2. Test with real backend (full integration)
3. Switch between modes instantly

Just change `VITE_USE_MOCK_DATA` in `.env` and restart!
