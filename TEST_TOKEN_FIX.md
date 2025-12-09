# 🔧 TOKEN KEY FIX APPLIED

## Problem Identified
The labour scheduling service was looking for `localStorage.getItem('token')` but the AuthContext stores the token as `localStorage.getItem('agrisense_token')`.

## Fix Applied
Updated `frontend/services/labourSchedulingService.ts` to use the correct token key: `agrisense_token`

## Changes Made
1. ✅ Fixed token retrieval in request interceptor
2. ✅ Fixed token check in response interceptor  
3. ✅ Fixed token validation in page component
4. ✅ Added console logging for debugging

## Testing Instructions

### Step 1: Clear Browser Cache & Refresh
```
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Close browser completely
5. Reopen browser
```

### Step 2: Login Fresh
```
1. Go to http://localhost:3000/auth/login
2. Login with: test@agrisense.com / Test@123
3. After login, open DevTools Console (F12)
```

### Step 3: Navigate to Labour Scheduling
```
1. Go to http://localhost:3000/features/labor-scheduling
2. Check Console for these messages:
   ✅ Token found, loading labour scheduling data...
   ✅ Token attached to request: eyJhbGciOiJIUzI1NiIs...
```

### Step 4: Verify Data Loads
You should see:
- ✅ Dashboard with stats (Total Workers, Active Tasks, etc.)
- ✅ Workers tab showing "John Doe" worker
- ✅ Tasks tab (may be empty)
- ✅ Alerts tab (may be empty)
- ✅ No 401 errors in console

### Step 5: Test Adding Worker
```
1. Click "Add Worker" button
2. Fill in form:
   - First Name: Jane
   - Last Name: Smith
   - Phone: +1234567890
   - Skills: Harvesting, Planting
   - Hourly Rate: 15
   - Availability: Select days
3. Click Submit
4. Worker should appear in Workers tab immediately
```

## Debugging Commands

### Check Token in Browser Console
```javascript
// Should return a JWT token string
localStorage.getItem('agrisense_token')

// Should return a timestamp
localStorage.getItem('agrisense_token_expiry')

// Check if token is expired
const expiry = localStorage.getItem('agrisense_token_expiry');
const isExpired = Date.now() > parseInt(expiry);
console.log('Token expired:', isExpired);
```

### Check Network Requests
```
1. Open DevTools > Network tab
2. Navigate to labour scheduling page
3. Look for requests to /api/labour-scheduling/*
4. Click on a request
5. Check "Request Headers" section
6. Should see: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Expected Results

### Before Fix
```
❌ 401 Unauthorized on all labour scheduling API calls
❌ No Authorization header in requests
❌ Workers/Tasks not loading
```

### After Fix
```
✅ 200 OK on all labour scheduling API calls
✅ Authorization header present with Bearer token
✅ Workers/Tasks loading correctly
✅ Can add new workers and tasks
```

## If Still Not Working

### Check 1: Token Exists
```javascript
const token = localStorage.getItem('agrisense_token');
if (!token) {
  console.error('No token - need to login again');
}
```

### Check 2: Token Format
```javascript
const token = localStorage.getItem('agrisense_token');
console.log('Token starts with:', token.substring(0, 20));
// Should start with: eyJhbGciOiJIUzI1NiIs
```

### Check 3: Backend Logs
Look for 401 errors in backend terminal:
```
::1 - - [DATE] "GET /api/labour-scheduling/workers HTTP/1.1" 401
```

If you see 401, the token is not being sent or is invalid.

### Check 4: Re-login
Sometimes the token gets corrupted. Try:
```javascript
// Clear all auth data
localStorage.removeItem('agrisense_token');
localStorage.removeItem('agrisense_token_expiry');
// Then login again
```

## Success Criteria
- ✅ No 401 errors in console
- ✅ Workers tab shows existing workers
- ✅ Can add new workers successfully
- ✅ Can add new tasks successfully
- ✅ Dashboard shows correct statistics
- ✅ Alerts load without errors

## Next Steps After Fix Works
1. Test creating multiple workers
2. Test creating tasks with worker assignments
3. Test shift scheduling
4. Test alert system
5. Test recommendations engine
