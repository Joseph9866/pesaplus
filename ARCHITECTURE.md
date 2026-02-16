# PesaPlus Frontend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PesaPlus Frontend                        │
│                    (React + TypeScript)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Environment Variable
                              │ VITE_USE_MOCK_DATA
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
         ┌──────────────────┐  ┌──────────────────┐
         │   Mock Mode      │  │   Real API Mode  │
         │   (Supabase)     │  │   (Django REST)  │
         └──────────────────┘  └──────────────────┘
                    │                   │
                    │                   │
                    ▼                   ▼
         ┌──────────────────┐  ┌──────────────────┐
         │  Local Storage   │  │  Django Backend  │
         │  Mock Data       │  │  + PostgreSQL    │
         └──────────────────┘  └──────────────────┘
```

## Authentication Flow

### Mock Mode Flow
```
┌──────────┐      ┌──────────────┐      ┌──────────────┐
│  Login   │─────▶│ AuthContext  │─────▶│   Supabase   │
│  Page    │      │              │      │  Mock Client │
└──────────┘      └──────────────┘      └──────────────┘
                         │                      │
                         │                      │
                         ▼                      ▼
                  ┌──────────────┐      ┌──────────────┐
                  │  User State  │      │ Mock Data    │
                  │  (Context)   │      │ Store        │
                  └──────────────┘      └──────────────┘
```

### Real API Mode Flow
```
┌──────────┐      ┌──────────────┐      ┌──────────────┐
│  Login   │─────▶│ AuthContext  │─────▶│ Auth Service │
│  Page    │      │              │      │              │
└──────────┘      └──────────────┘      └──────────────┘
                         │                      │
                         │                      ▼
                         │              ┌──────────────┐
                         │              │ API Client   │
                         │              │ (Axios)      │
                         │              └──────────────┘
                         │                      │
                         │                      ▼
                         │              ┌──────────────┐
                         │              │ JWT Token    │
                         │              │ Interceptor  │
                         │              └──────────────┘
                         │                      │
                         │                      ▼
                         │              ┌──────────────┐
                         │              │   Django     │
                         │              │   Backend    │
                         │              └──────────────┘
                         │                      │
                         ▼                      ▼
                  ┌──────────────┐      ┌──────────────┐
                  │  User State  │◀─────│ User Data    │
                  │  (Context)   │      │ (API)        │
                  └──────────────┘      └──────────────┘
```

## JWT Token Management

```
┌─────────────────────────────────────────────────────────┐
│                    API Request Flow                      │
└─────────────────────────────────────────────────────────┘

1. User makes API request
         │
         ▼
2. Request Interceptor
   ├─ Get access token from localStorage
   └─ Add to Authorization header
         │
         ▼
3. Send request to Django
         │
         ├─ Success (200) ──────────────────┐
         │                                   │
         └─ Unauthorized (401)               │
                  │                          │
                  ▼                          │
         4. Token expired?                   │
                  │                          │
                  ├─ Yes                     │
                  │   │                      │
                  │   ▼                      │
                  │ 5. Get refresh token     │
                  │   │                      │
                  │   ▼                      │
                  │ 6. Call /token/refresh/  │
                  │   │                      │
                  │   ├─ Success             │
                  │   │   │                  │
                  │   │   ▼                  │
                  │   │ 7. Save new token    │
                  │   │   │                  │
                  │   │   ▼                  │
                  │   │ 8. Retry request ────┤
                  │   │                      │
                  │   └─ Failure             │
                  │       │                  │
                  │       ▼                  │
                  │   9. Clear tokens        │
                  │       │                  │
                  │       ▼                  │
                  │   10. Redirect to login  │
                  │                          │
                  └─ No                      │
                      │                      │
                      ▼                      │
                  Clear tokens               │
                      │                      │
                      ▼                      │
                  Redirect to login          │
                                            │
                                            ▼
                                    11. Return response
```

## File Structure

```
src/
├── lib/
│   ├── api/                          # Real API integration
│   │   ├── config.ts                 # API endpoints & config
│   │   ├── client.ts                 # Axios client + JWT
│   │   └── services/
│   │       └── auth.ts               # Auth service layer
│   │
│   ├── mockDataProvider.ts          # Mock Supabase client
│   ├── mockDataStore.ts             # Mock data storage
│   ├── mockSeedData.ts              # Test data generator
│   ├── dataProvider.ts              # Mode switcher
│   └── supabase.ts                  # Export wrapper
│
├── contexts/
│   ├── AuthContext.tsx              # Auth state management
│   └── CurrencyContext.tsx          # Currency preferences
│
├── pages/
│   ├── Login.tsx                    # Login page
│   ├── Signup.tsx                   # Signup page
│   └── ...                          # Other pages
│
└── types/
    └── index.ts                     # TypeScript types
```

## Data Flow

### Component → API Call

```
┌──────────────┐
│  Component   │
│  (e.g. Login)│
└──────┬───────┘
       │
       │ useAuth()
       ▼
┌──────────────┐
│ AuthContext  │
└──────┬───────┘
       │
       │ Check VITE_USE_MOCK_DATA
       │
       ├─ true ──────────┐
       │                 │
       │                 ▼
       │         ┌──────────────┐
       │         │   Supabase   │
       │         │  Mock Client │
       │         └──────┬───────┘
       │                │
       │                ▼
       │         ┌──────────────┐
       │         │  Mock Data   │
       │         │    Store     │
       │         └──────┬───────┘
       │                │
       └─ false ────────┤
                        │
                        ▼
                ┌──────────────┐
                │ Auth Service │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │  API Client  │
                │   (Axios)    │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │   Django     │
                │   Backend    │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │  PostgreSQL  │
                └──────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                    React Context API                     │
└─────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐
│ AuthContext  │         │   Currency   │
│              │         │   Context    │
├──────────────┤         ├──────────────┤
│ - user       │         │ - currency   │
│ - loading    │         │ - rate       │
│ - signUp()   │         │ - convert()  │
│ - signIn()   │         │ - setCurr()  │
│ - signOut()  │         └──────────────┘
│ - refresh()  │
└──────────────┘

        │                        │
        └────────┬───────────────┘
                 │
                 ▼
         ┌──────────────┐
         │     App      │
         │  Component   │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │    Pages     │
         │  Components  │
         └──────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
└─────────────────────────────────────────────────────────┘

1. Environment Variables
   └─ API URLs, keys stored in .env (not in git)

2. JWT Authentication
   ├─ Access token (short-lived)
   └─ Refresh token (long-lived)

3. Token Storage
   └─ localStorage (consider httpOnly cookies for prod)

4. Request Interceptors
   ├─ Auto-inject tokens
   └─ Auto-refresh expired tokens

5. Protected Routes
   └─ Redirect to login if not authenticated

6. HTTPS
   └─ All API calls over HTTPS in production

7. Input Validation
   ├─ Zod schemas
   └─ React Hook Form validation
```

## Performance Optimizations

```
┌─────────────────────────────────────────────────────────┐
│                  Performance Features                    │
└─────────────────────────────────────────────────────────┘

1. Code Splitting
   └─ React.lazy() for route-based splitting

2. Request Caching
   └─ Axios response caching (future)

3. Token Refresh Queue
   └─ Batch failed requests during token refresh

4. Lazy Loading
   └─ Components loaded on demand

5. Memoization
   └─ React.memo() for expensive components

6. Context Optimization
   └─ Separate contexts to avoid unnecessary re-renders
```

## Testing Strategy

```
┌─────────────────────────────────────────────────────────┐
│                    Testing Layers                        │
└─────────────────────────────────────────────────────────┘

1. Unit Tests
   ├─ Currency conversion utilities
   ├─ Helper functions
   └─ Individual components

2. Integration Tests
   ├─ Currency flow (Settings → Display)
   ├─ Auth flow (Login → Dashboard)
   └─ API service layer

3. E2E Tests (Future)
   ├─ Complete user journeys
   └─ Cross-browser testing

4. Mock Data Testing
   └─ Test without backend dependency
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Setup                      │
└─────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐
│   Frontend   │────────▶│   Backend    │
│   (Vercel/   │  HTTPS  │   (Django)   │
│   Netlify)   │         │              │
└──────────────┘         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │  PostgreSQL  │
                         │   Database   │
                         └──────────────┘

Environment Variables:
- VITE_USE_MOCK_DATA=false
- VITE_API_BASE_URL=https://api.pesaplus.com
```

## Key Design Decisions

1. **Dual Mode Support**: Mock + Real API for flexible development
2. **JWT Authentication**: Industry standard, stateless, scalable
3. **Automatic Token Refresh**: Better UX, no manual token handling
4. **TypeScript**: Type safety, better DX, fewer runtime errors
5. **Context API**: Simple state management, no external dependencies
6. **Axios**: Powerful HTTP client with interceptors
7. **Environment-based Config**: Easy switching between modes

## Future Enhancements

1. **Service Workers**: Offline support
2. **WebSockets**: Real-time updates
3. **Push Notifications**: User engagement
4. **Biometric Auth**: Enhanced security
5. **Multi-language**: i18n support
6. **Analytics**: User behavior tracking
7. **Error Tracking**: Sentry integration
