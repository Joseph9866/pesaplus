# Signup 400 Error - FIXED! ✅

## The Problem

The backend was expecting:
- `password1` (not `password`)
- `password2` (password confirmation)
- `role` (user role field)

## The Fix

I've updated the code to send the correct fields:

### Changes Made

1. **Updated `src/lib/api/services/auth.ts`**:
   ```typescript
   export interface RegisterRequest {
     email: string;
     password1: string;  // Changed from 'password'
     password2: string;  // Password confirmation
     full_name: string;
     role: string;       // Added role field
   }
   ```

2. **Updated `src/contexts/AuthContext.tsx`**:
   ```typescript
   await authService.register({
     email,
     password1: password,  // Backend expects password1
     password2: password,  // Password confirmation
     full_name: fullName,
     role: 'member',       // Default role for new users
   });
   ```

## How to Test

1. **Make sure `.env` has**:
   ```env
   VITE_USE_MOCK_DATA=false
   ```

2. **Restart the dev server**:
   ```bash
   npm run dev
   ```

3. **Try to sign up** with:
   - Email: `test@example.com`
   - Password: `password123`
   - Full Name: `Test User`

4. **It should work now!** ✅

## What Gets Sent to Backend

The registration request now sends:
```json
{
  "email": "test@example.com",
  "password1": "password123",
  "password2": "password123",
  "full_name": "Test User",
  "role": "member"
}
```

## Default Role

I set the default role to `'member'`. If the backend expects a different role (like `'user'`, `'customer'`, etc.), you can change it in `src/contexts/AuthContext.tsx`:

```typescript
role: 'user',  // Change this to whatever the backend expects
```

## Common Roles

Depending on your backend setup, the role might be:
- `'member'` - Regular member
- `'user'` - Regular user
- `'customer'` - Customer
- `'client'` - Client

If you're not sure, ask your backend developer what role value to use for new signups.

## Next Steps

1. Test signup with the real backend
2. If it works, you can now:
   - Create new accounts
   - Login with those accounts
   - Test the full authentication flow

3. If you get another error, check the console for the error message and let me know!

## Switching Back to Mock Mode

If you want to test with mock data again:

```env
# In .env file
VITE_USE_MOCK_DATA=true
```

Then restart the dev server.

## Success! 🎉

The signup should now work with your Django backend!
