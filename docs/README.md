# API Documentation

This folder contains API documentation for the PesaPlus backend.

## Files

- `openapi.yaml` - OpenAPI specification for the Django REST API backend

## How to Use

1. **View the API spec**: Open `openapi.yaml` in any text editor
2. **Use Swagger UI**: You can view it in a nice UI at https://editor.swagger.io/
3. **Generate types**: Use tools like `openapi-typescript` to generate TypeScript types

## Backend API Base URL

```
https://tj85nw4s-8000.uks1.devtunnels.ms/api/v1
```

## Authentication

The API uses JWT (JSON Web Token) authentication:
- Login to get `access` and `refresh` tokens
- Include access token in requests: `Authorization: Bearer <token>`
- Refresh token when it expires

## Available Endpoints

See `openapi.yaml` for complete list of endpoints.

### Currently Integrated

- ✅ Authentication (register, login, logout)
- ✅ User profile
- ⏳ Goals (endpoint path needs confirmation)
- ⏳ Accounts
- ⏳ KYC
- ⏳ Transactions
- ⏳ Challenges
- ⏳ Rewards
