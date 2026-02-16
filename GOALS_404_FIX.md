# Goals 404 Error - Configuration Guide

## The Problem

Getting 404 error when creating goals means the goals endpoint doesn't exist at the URL we're calling.

## Current Configuration

The app is currently trying to call:
```
POST https://tj85nw4s-8000.uks1.devtunnels.ms/api/v1/goals/
```

## How to Find the Correct Endpoint

### Step 1: Check Browser Console

When you try to create a goal, check the console for these messages:
```
Creating goal at: https://tj85nw4s-8000.uks1.devtunnels.ms/api/v1/goals/
Error creating goal: ...
Attempted URL: ...
```

### Step 2: Ask Backend Developer

Ask your backend developer:
1. **Does the goals endpoint exist?**
2. **What is the correct URL for goals?**

Common possibilities:
- `/api/v1/goals/`
- `/api/v1/accounts/api/goals/` (following the accounts pattern)
- `/api/v1/savings/goals/`
- `/goals/` (no version prefix)

### Step 3: Check OpenAPI/Swagger Docs

If your backend has Swagger docs, check:
```
https://tj85nw4s-8000.uks1.devtunnels.ms/swagger/
https://tj85nw4s-8000.uks1.devtunnels.ms/api/docs/
https://tj85nw4s-8000.uks1.devtunnels.ms/redoc/
```

## How to Fix

Once you know the correct endpoint, update `src/lib/api/config.ts`:

### Example 1: If goals are under accounts

```typescript
goals: {
  list: `${API_URL}/accounts/api/goals/`,
  detail: (id: string) => `${API_URL}/accounts/api/goals/${id}/`,
  create: `${API_URL}/accounts/api/goals/`,
  update: (id: string) => `${API_URL}/accounts/api/goals/${id}/`,
  delete: (id: string) => `${API_URL}/accounts/api/goals/${id}/`,
  addFunds: (id: string) => `${API_URL}/accounts/api/goals/${id}/add_funds/`,
  withdrawFunds: (id: string) => `${API_URL}/accounts/api/goals/${id}/withdraw_funds/`,
},
```

### Example 2: If goals are under savings

```typescript
goals: {
  list: `${API_URL}/savings/goals/`,
  detail: (id: string) => `${API_URL}/savings/goals/${id}/`,
  create: `${API_URL}/savings/goals/`,
  update: (id: string) => `${API_URL}/savings/goals/${id}/`,
  delete: (id: string) => `${API_URL}/savings/goals/${id}/`,
  addFunds: (id: string) => `${API_URL}/savings/goals/${id}/add_funds/`,
  withdrawFunds: (id: string) => `${API_URL}/savings/goals/${id}/withdraw_funds/`,
},
```

### Example 3: If no version prefix

```typescript
goals: {
  list: `${API_BASE_URL}/goals/`,
  detail: (id: string) => `${API_BASE_URL}/goals/${id}/`,
  create: `${API_BASE_URL}/goals/`,
  update: (id: string) => `${API_BASE_URL}/goals/${id}/`,
  delete: (id: string) => `${API_BASE_URL}/goals/${id}/`,
  addFunds: (id: string) => `${API_BASE_URL}/goals/${id}/add_funds/`,
  withdrawFunds: (id: string) => `${API_BASE_URL}/goals/${id}/withdraw_funds/`,
},
```

## Testing with curl

You can test the endpoint directly:

```bash
# Get your access token from localStorage (check browser DevTools → Application → Local Storage)
TOKEN="your_access_token_here"

# Try to list goals
curl -X GET https://tj85nw4s-8000.uks1.devtunnels.ms/api/v1/goals/ \
  -H "Authorization: Bearer $TOKEN"

# If 404, try other paths:
curl -X GET https://tj85nw4s-8000.uks1.devtunnels.ms/api/v1/accounts/api/goals/ \
  -H "Authorization: Bearer $TOKEN"

curl -X GET https://tj85nw4s-8000.uks1.devtunnels.ms/goals/ \
  -H "Authorization: Bearer $TOKEN"
```

## If Goals Endpoint Doesn't Exist Yet

If the backend doesn't have goals endpoints yet, you have two options:

### Option 1: Use Mock Mode (Temporary)

Switch back to mock mode while backend implements goals:

```env
# In .env
VITE_USE_MOCK_DATA=true
```

This lets you continue frontend development.

### Option 2: Ask Backend to Implement

Share this with your backend developer - they need to create:

**Required Endpoints:**
```
GET    /api/v1/goals/              - List all goals for current user
POST   /api/v1/goals/              - Create new goal
GET    /api/v1/goals/{id}/         - Get single goal
PUT    /api/v1/goals/{id}/         - Update goal
PATCH  /api/v1/goals/{id}/         - Partial update
DELETE /api/v1/goals/{id}/         - Delete goal
```

**Optional Endpoints:**
```
POST   /api/v1/goals/{id}/add_funds/      - Add funds to goal
POST   /api/v1/goals/{id}/withdraw_funds/ - Withdraw funds
```

**Goal Model Fields:**
```python
{
    "id": "uuid",
    "user_id": "uuid",
    "title": "string",
    "target_amount": "decimal",
    "current_amount": "decimal",
    "deadline": "date",
    "icon": "string",
    "color": "string",
    "status": "string (active/completed/paused)",
    "auto_save_enabled": "boolean",
    "auto_save_amount": "decimal (nullable)",
    "auto_save_frequency": "string (daily/weekly/monthly, nullable)",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

## After Fixing

1. Update `src/lib/api/config.ts` with correct endpoint
2. Restart dev server: `npm run dev`
3. Try creating a goal again
4. Check console for success message: "Goal created successfully"

## Need Help?

Share with me:
1. The console error message
2. The URL it's trying to call
3. What your backend developer says the correct endpoint should be

I'll help you configure it correctly!
