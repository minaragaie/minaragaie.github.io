# Manual Admin Testing Guide

## Step 1: Authentication Setup

1. **Navigate to**: `http://localhost:3000`
2. **You should see**: "Authentication Required" page
3. **Press**: `Shift + Cmd + A` (on Mac) or `Shift + Ctrl + A` (on Windows/Linux)
4. **Auth Terminal should open**
5. **Enter credentials**:
   - Username: `mina`
   - Password: `pass!100`
6. **Press Enter** to authenticate

## Step 2: Access Admin Page

1. **Navigate to**: `http://localhost:3000/admin`
2. **You should see**: Admin dashboard with tabs (Personal, Experience, Skills, etc.)

## Step 3: Test Input Performance

1. **Go to Personal Info tab**
2. **Click on "Full Name" input field**
3. **Type rapidly**: "Test User Name Here"
4. **Check console for violations**:
   - Open DevTools (F12)
   - Look for `[Violation]` messages
   - Look for `Maximum update depth exceeded` errors

## Step 4: Test CRUD Operations

### Test Adding Skills:
1. **Go to Skills tab**
2. **Click "Add Technical Skill"**
3. **Type**: "React Testing"
4. **Click "Add Soft Skill"**
5. **Type**: "Communication"

### Test Adding Experience:
1. **Go to Experience tab**
2. **Click "Add Experience"**
3. **Fill in fields**: Company, Title, Dates, Description

### Test Save Functionality:
1. **Make changes to any field**
2. **Wait 3 seconds** (debounce period)
3. **Check save status** in header
4. **Look for API calls** in Network tab

## Step 5: Performance Monitoring

### What to Look For:
- **Good Performance**: Smooth typing, no console violations
- **Bad Performance**: Laggy typing, many `[Violation]` messages, `Maximum update depth exceeded`

### Console Commands to Run:
```javascript
// Check current performance metrics
console.log('Performance Metrics:', window.performanceMetrics || 'Not available');

// Check for render count
console.log('Render Count:', document.querySelector('[data-testid="render-count"]')?.textContent);

// Monitor API calls
console.log('API Calls:', document.querySelector('[data-testid="api-calls"]')?.textContent);
```

## Expected Results

### ✅ Good Performance:
- Typing feels smooth and responsive
- Console is clean (minimal errors)
- Save status shows "Saved" after 3 seconds
- No infinite loops or excessive re-renders

### ❌ Bad Performance:
- Typing feels laggy or "heavy"
- Console filled with `[Violation]` messages
- `Maximum update depth exceeded` errors
- App becomes unresponsive

## Troubleshooting

### If Authentication Fails:
1. Check if backend is running
2. Verify credentials are correct
3. Check browser console for CORS errors

### If Admin Page Doesn't Load:
1. Check if user is authenticated
2. Look for API errors in Network tab
3. Check for JavaScript errors in console

### If Inputs Are Still Laggy:
1. Check console for performance violations
2. Look for infinite render loops
3. Verify localFormData is being used for inputs

## Current Known Issues

1. **Backend 500 Error**: `EROFS: read-only file system` - This is a server-side issue
2. **CORS Errors**: May occur if backend headers aren't configured properly
3. **Authentication Redirect Loop**: May happen if API calls fail during auth check

## Test Results

Please run through these tests and report:
1. **Authentication**: ✅ Working / ❌ Failing
2. **Input Performance**: ✅ Smooth / ❌ Laggy
3. **CRUD Operations**: ✅ Working / ❌ Failing
4. **Console Errors**: List any violations or errors found

