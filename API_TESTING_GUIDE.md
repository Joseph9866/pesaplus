# API Testing Guide

## Testing Signup with Real Backend

### Step 1: Check Browser Console

When you try to signup and get a 400 error, open the browser console (F12) and look for:

1. **Request Details**:
   ```
   Registering user with data: { email: "...", full_name: "...", password: "[REDACTED]" }
   ```

2. **Error Response**:
   ```
   Registration error: { field_name: ["error message"] }
   ```

### Step 2: Common Django Registration Field Requirements

Django REST Framework typically expects one of these field combinations:

#### Option 1: Basic Registration
```json
{
  "email": "user@example.com",
  "password": "password123",
  "password2": "password123",
  "full_name": "John Doe"
}
```

#### Option 2: With Username
```json
{
  "username": "johndoe",
  "email": "user@example.com",
  "password": "password123",
  "password2": "password123",
  "full_name": "John Doe"
}
```

#### Option 3: Split Name Fields
```json
{
  "email": "user@example.com",
  "password": "password123",
  "password2": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### Step 3: Check Backend Requirements

The 400 error usually means one of these issues:

1. **Missing Required Field**: Backend expects a field we're not sending
2. **Invalid Field Name**: We're using `full_name` but backend expects `first_name` and `last_name`
3. **Password Validation**: Password doesn't meet backend requirements (length, complexity, etc.)
4. **Email Validation**: Email format is invalid or already exists
5. **Missing password2**: Backend requires password confirmation

### Step 4: Test with curl

You can test the backend directly with curl to see what it expects:

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

### Step 5: Check Error Message

The updated Signup page now shows detailed error messages. Look for:

- Field-specific errors: "email: This field is required"
- Validation errors: "password: This password is too short"
- General errors: "User with this email already exists"

### Step 6: Common Fixes

#### If backend expects `username`:
Update `src/lib/api/services/auth.ts`:
```typescript
register: async (data: RegisterRequest): Promise<RegisterResponse> => {
  const requestData = {
    ...data,
    username: data.email.split('@')[0], // Use email prefix as username
  };
  
  const response = await apiClient.post<RegisterResponse>(
    API_ENDPOINTS.auth.register,
    requestData
  );
  // ...
}
```

#### If backend expects split name fields:
Update `src/contexts/AuthContext.tsx`:
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

#### If backend has password requirements:
Check the error message for requirements like:
- Minimum 8 characters
- Must contain uppercase and lowercase
- Must contain numbers
- Must contain special characters

### Step 7: Contact Backend Developer

If the error persists, ask the backend developer:

1. What fields are required for registration?
2. What is the exact request body format?
3. What are the password validation rules?
4. Can they provide a sample successful registration request?
5. Is there API documentation (Swagger/OpenAPI)?

### Step 8: Temporary Workaround

While debugging, you can use mock mode:
```env
VITE_USE_MOCK_DATA=true
```

This lets you continue testing the frontend while the backend integration is being fixed.

## Current Implementation

The current code sends:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "password2": "password123",
  "full_name": "John Doe"
}
```

If this doesn't work, check the console for the exact error message and adjust accordingly.
