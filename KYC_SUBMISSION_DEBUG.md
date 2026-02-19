# KYC Submission Troubleshooting Guide

## Issue
KYC details are not submitting when clicking "Submit for Review" button.

## Potential Causes & Solutions

### 1. Backend Connection Issue
**Problem**: The Django backend at `https://tj85nw4s-8000.uks1.devtunnels.ms/` might not be accessible.

**Check**:
- Open browser DevTools (F12)
- Go to Console tab
- Look for network errors or CORS errors
- Check Network tab for failed requests to `/api/v1/accounts/api/kyc/`

**Solution A - Use Mock Mode** (Quick Fix):
```env
# In .env file, change:
VITE_USE_MOCK_DATA=true
```
This will use mock data instead of the real backend.

**Solution B - Fix Backend Connection**:
- Ensure Django backend is running on port 8000
- Verify the dev tunnel is active and accessible
- Check if the backend URL is correct

### 2. Authentication Token Missing
**Problem**: User might not be properly authenticated, so API requests are failing with 401 errors.

**Check**:
- Open browser DevTools → Application tab → Local Storage
- Look for `access_token` and `refresh_token` keys
- If missing, you're not logged in

**Solution**:
1. Log out completely
2. Log back in using the Login page
3. Try KYC submission again

### 3. CORS Configuration
**Problem**: Backend might not allow requests from your frontend origin.

**Check Console for**:
```
Access to XMLHttpRequest at 'https://...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution** (Backend Django settings):
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

### 4. Missing Required Fields
**Problem**: Backend validation might be rejecting the submission due to missing fields.

**Check**:
- Look in Console for error messages
- Check Network tab → Response for validation errors

**Current Submission Data**:
The KYCReview page submits:
- `id_number`
- `kra_pin`
- `gender`
- `marital_status`
- `country`
- `county`
- `kyc_submitted: true`
- `kyc_confirmed: false`

**Note**: Document uploads (ID front/back, selfie) are NOT being sent with the submission. This might be intentional or a bug.

### 5. Backend API Endpoint Mismatch
**Problem**: The endpoint might not match what the backend expects.

**Current Endpoint**: `POST /api/v1/accounts/api/kyc/`

**Check Backend**:
- Verify this endpoint exists
- Check if it requires different field names
- Verify HTTP method (POST for create, PATCH for update)

## Quick Diagnostic Steps

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Click "Submit for Review"
4. Look for error messages

### Step 2: Check Network Requests
1. Open DevTools → Network tab
2. Click "Submit for Review"
3. Look for the request to `/kyc/`
4. Check:
   - Status code (200 = success, 400 = validation error, 401 = auth error, 500 = server error)
   - Response body for error details
   - Request payload to see what's being sent

### Step 3: Verify Authentication
1. DevTools → Application → Local Storage
2. Check for `access_token`
3. If missing, log in again

### Step 4: Test with Mock Mode
1. Change `.env`: `VITE_USE_MOCK_DATA=true`
2. Restart dev server
3. Try submission again
4. If it works, the issue is backend connectivity

## Common Error Messages

### "Unable to connect. Please check your internet connection"
- Backend is not accessible
- Dev tunnel might be expired
- Network connectivity issue

### "Your session has expired. Please log in again"
- Access token is missing or invalid
- Need to log in again

### "Please check your input and try again"
- Validation error from backend
- Check Console/Network for specific field errors

### "Server error occurred. Please try again in a few moments"
- Backend returned 500 error
- Check backend logs for details

## Recommended Immediate Fix

**Switch to Mock Mode** (fastest solution):

1. Edit `.env`:
```env
VITE_USE_MOCK_DATA=true
```

2. Restart your dev server:
```bash
npm run dev
```

3. Try KYC submission again

This will bypass backend connectivity issues and let you test the flow with mock data.

## Need More Help?

Share the following information:
1. Console error messages (screenshot or copy/paste)
2. Network tab showing the failed request (status code, response)
3. Whether you're logged in (check Local Storage for tokens)
4. Backend status (is it running? accessible?)
