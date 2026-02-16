# Backend Integration Guide

## Overview

The PesaPlus frontend now supports both mock data (for development/testing) and real Django REST Framework backend API integration.

## Configuration

### Environment Variables

The `.env` file controls which data source to use:

```env
# Django Backend API Configuration
VITE_API_BASE_URL=https://tj85nw4s-8000.uks1.devtunnels.ms

# Mock Data Configuration
# Set to 'false' to use real Django backend API
# Set to 'true' to use mock data for testing
VITE_USE_MOCK_DATA=false
```

### Switching Between Mock and Real API

1. **Use Mock Data** (for testing without backend):
   ```env
   VITE_USE_MOCK_DATA=true
   ```

2. **Use Real Backend API**:
   ```env
   VITE_USE_MOCK_DATA=false
   ```

After changing the environment variable, restart the development server.

## Backend API Structure

### Base URL
```
https://tj85nw4s-8000.uks1.devtunnels.ms/api/v1
```

### Authentication

The backend uses JWT (JSON Web Token) authentication:

- **Access Token**: Short-lived token for API requests (sent in `Authorization: Bearer <token>` header)
- **Refresh Token**: Long-lived token for obtaining new access tokens
- **Token Storage**: Tokens are stored in `localStorage`
- **Auto-Refresh**: The API client automatically refreshes expired access tokens

### API Endpoints

#### Authentication (`/auth/`)
- `POST /auth/register/` - Register new user
- `POST /auth/login/` - Login user
- `POST /auth/logout/` - Logout user
- `POST /auth/token/refresh/` - Refresh access token
- `POST /auth/token/verify/` - Verify token validity
- `GET /auth/user/` - Get current user profile
- `POST /auth/password/change/` - Change password
- `POST /auth/password/reset/` - Request password reset
- `POST /auth/password/reset/confirm/` - Confirm password reset

#### Accounts (`/accounts/api/`)
- `GET /accounts/api/accounts/` - List user accounts
- `GET /accounts/api/accounts/{accountNumber}/` - Get account details

#### KYC (`/accounts/api/kyc/`)
- `GET /accounts/api/kyc/` - List KYC records
- `GET /accounts/api/kyc/{membershipNumber}/` - Get KYC details
- `POST /accounts/api/kyc/` - Submit KYC information
- `PUT /accounts/api/kyc/{membershipNumber}/` - Update KYC information

#### Next of Kin (`/accounts/api/next-of-kins/`)
- `GET /accounts/api/next-of-kins/` - List next of kin records
- `GET /accounts/api/next-of-kins/{id}/` - Get next of kin details
- `POST /accounts/api/next-of-kins/` - Add next of kin
- `PUT /accounts/api/next-of-kins/{id}/` - Update next of kin

#### Users (`/users/api/`)
- `GET /users/api/users/` - List users
- `GET /users/api/users/{id}/` - Get user details

## Implementation Details

### File Structure

```
src/lib/api/
├── config.ts           # API configuration and endpoints
├── client.ts           # Axios client with JWT interceptors
└── services/
    └── auth.ts         # Authentication service layer
```

### API Client Features

1. **Automatic Token Injection**: Access tokens are automatically added to request headers
2. **Token Refresh**: Expired tokens are automatically refreshed
3. **Request Queuing**: Failed requests are queued during token refresh and retried
4. **Error Handling**: 401 errors trigger token refresh or redirect to login
5. **Timeout**: 30-second request timeout

### Authentication Flow

#### Registration
```typescript
import { authService } from './lib/api/services/auth';

await authService.register({
  email: 'user@example.com',
  password: 'password123',
  full_name: 'John Doe',
});
```

#### Login
```typescript
await authService.login({
  email: 'user@example.com',
  password: 'password123',
});
```

#### Logout
```typescript
await authService.logout();
```

#### Get Current User
```typescript
const user = await authService.getCurrentUser();
```

### AuthContext Integration

The `AuthContext` automatically detects whether to use mock data or real API based on `VITE_USE_MOCK_DATA`:

```typescript
// In AuthContext.tsx
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

if (USE_MOCK_DATA) {
  // Use Supabase mock implementation
} else {
  // Use Django REST API
}
```

## Testing

### Mock Mode Testing

Test credentials (when `VITE_USE_MOCK_DATA=true`):
- `new-user@test.com` / `password123`
- `active-user@test.com` / `password123`
- `power-user@test.com` / `password123`

### Real API Testing

1. Ensure backend is running at the configured URL
2. Set `VITE_USE_MOCK_DATA=false` in `.env`
3. Restart the development server
4. Register a new account or login with existing credentials

## Next Steps

### Remaining Integration Tasks

1. **Accounts Service**: Create `src/lib/api/services/accounts.ts` for account management
2. **KYC Service**: Create `src/lib/api/services/kyc.ts` for KYC operations
3. **Goals Service**: Integrate goals API endpoints
4. **Transactions Service**: Integrate transaction endpoints
5. **Challenges Service**: Integrate challenges and lottery endpoints
6. **Update Pages**: Replace mock data calls with real API calls in:
   - Dashboard
   - Goals pages
   - Rewards page
   - Social page
   - Profile page
   - KYC pages

### Error Handling

Add proper error handling for:
- Network errors
- API validation errors
- Authentication errors
- Rate limiting

### Loading States

Implement loading indicators for:
- Login/signup
- Data fetching
- Form submissions

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend has proper CORS configuration
2. **Token Expiration**: Check token refresh logic in `client.ts`
3. **Network Errors**: Verify backend URL is accessible
4. **401 Errors**: Check if tokens are being stored correctly

### Debug Mode

Enable axios debug logging:
```typescript
// In client.ts
apiClient.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});
```

## Security Considerations

1. **Token Storage**: Tokens are stored in `localStorage` (consider `httpOnly` cookies for production)
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Access tokens should have short expiration times
4. **Refresh Token Rotation**: Implement refresh token rotation for better security
5. **XSS Protection**: Sanitize user inputs to prevent XSS attacks

## Dependencies

- `axios`: HTTP client for API requests
- `@supabase/supabase-js`: Mock data provider (development only)

## Support

For backend API issues, contact the backend development team.
For frontend integration issues, check the implementation in `src/lib/api/` and `src/contexts/AuthContext.tsx`.
