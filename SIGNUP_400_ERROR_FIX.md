# Signup 400 Error - Debugging Guide

## What I Did

I've updated the code to help you debug the 400 error when signing up with the real backend.

### Changes Made

1. **Enhanced Error Messages** (`src/pages/Signup.tsx`):
   - Now shows detailed error messages from the backend
   - Displays field-specific validation errors
   - Logs full error details to console

2. **Added Password Confirmation** (`src/contexts/AuthContext.tsx`):
   - Now sends `password2` field (Django often requires this)
   - Format: `{ email, password, password2, full_name }`

3. **Added Logging** (`src/lib/api/services/auth.ts`):
   - Logs registration request (with password redacted)
   - Logs detailed error responses
   - Helps identify what the backend is rejecting

### How to Debug

1. **Open Browser Console** (F12 → Console tab)

2. **Try to Sign Up** with any email/password

3. **Look for These Messages**:
   ```
   Registering user with data: { email: "...", full_name: "...", password: "[REDACTED]", password2: "[REDACTED]" }
   Registration error: { ... }
   ```

4. **Check the Error Response**:
   - It will show exactly what fields the backend is complaining about
   - Example: `{ "email": ["This field is required"] }`
   - Example: `{ "password": ["This password is too short"] }`
   - Example: `{ "username": ["This field is required"] }`

### Common Issues & Solutions

#### Issue 1: Backend Expects `username`

If error says: `{ "username": ["This field is required"] }`

**Solution**: Update `src/lib/api/services/auth.ts`:
```typescript
register: async (data: RegisterRequest): Promise<RegisterResponse> => {
  const requestData = {
    ...data,
    username: data.email.split('@')[0], // Use email prefix as username
  };
  
  console.log('Registering user with data:', { ...requestData, password: '[REDACTED]' });
  
  try {
    const response = await apiClient.post<RegisterResponse>(
      API_ENDPOINTS.auth.register,
      requestData
    );
    // ... rest of code
  }
}
```

#### Issue 2: Backend Expects `first_name` and `last_name`

If error says: `{ "first_name": ["This field is required"] }`

**Solution**: Update `src/contexts/AuthContext.tsx`:
```typescript
const nameParts = fullName.split(' ');
await authService.register({
  email,
  password,
  password2: password,
  first_name: nameParts[0],
  last_name: nameParts.slice(1).join(' ') || nameParts[0],
});
```

#### Issue 3: Password Too Short

If error says: `{ "password": ["Ensure this field has at least 8 characters"] }`

**Solution**: Update validation in `src/pages/Signup.tsx`:
```typescript
const signupSchema = z.object({
  // ... other fields
  password: z.string().min(8, 'Password must be at least 8 characters'),
  // ...
});
```

#### Issue 4: Email Already Exists

If error says: `{ "email": ["User with this email already exists"] }`

**Solution**: Try a different email address

### Next Steps

1. **Run the app**: `npm run dev`
2. **Try to sign up** with test data
3. **Check the console** for error details
4. **Share the error message** with me or the backend developer

### Test Command

You can also test the backend directly with curl:

```bash
curl -X POST https://tj85nw4s-8000.uks1.devtunnels.ms/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "password2": "testpass123",
    "full_name": "Test User"
  }'
```

This will show you exactly what the backend returns.

### Temporary Workaround

While debugging, you can switch back to mock mode:

```env
# In .env file
VITE_USE_MOCK_DATA=true
```

Then restart the dev server. This lets you continue testing the frontend.

### What to Share

If you need help, share:
1. The error message from the browser console
2. The "Registration error:" log output
3. The email/password you're trying to use (don't share real passwords!)

I'll help you fix it based on what the backend is expecting!
