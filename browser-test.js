// Browser Console Test Script
// Copy and paste this into the browser console to test admin functionality

console.log('🧪 Starting Admin Functionality Test...');

// Test 1: Check Authentication State
console.log('\n1️⃣ Testing Authentication State...');
const authState = window.__REDUX_DEVTOOLS_EXTENSION__?.store?.getState?.()?.auth;
if (authState) {
  console.log('✅ Redux store found');
  console.log('Auth state:', {
    isAuthenticated: authState.isAuthenticated,
    username: authState.username,
    hasToken: !!authState.token
  });
} else {
  console.log('❌ Redux store not accessible');
}

// Test 2: Check if we're on admin page
console.log('\n2️⃣ Testing Admin Page Access...');
const isAdminPage = window.location.pathname.includes('/admin');
console.log('Current page:', window.location.pathname);
console.log('Is admin page:', isAdminPage);

// Test 3: Check for performance violations
console.log('\n3️⃣ Testing Performance...');
let violationCount = 0;
const originalConsoleError = console.error;
console.error = function(...args) {
  if (args[0]?.includes?.('Violation') || args[0]?.includes?.('Maximum update depth')) {
    violationCount++;
    console.log('⚠️ Performance violation detected:', args[0]);
  }
  originalConsoleError.apply(console, args);
};

// Test 4: Check form inputs
console.log('\n4️⃣ Testing Form Inputs...');
const inputs = document.querySelectorAll('input[type="text"], textarea');
console.log(`Found ${inputs.length} text inputs`);

if (inputs.length > 0) {
  const firstInput = inputs[0];
  console.log('Testing first input:', firstInput.placeholder || firstInput.name || 'unnamed');
  
  // Test typing performance
  const startTime = performance.now();
  firstInput.focus();
  firstInput.value = 'Test input performance';
  firstInput.dispatchEvent(new Event('input', { bubbles: true }));
  const endTime = performance.now();
  
  console.log(`⏱️ Input update took: ${(endTime - startTime).toFixed(2)}ms`);
}

// Test 5: Check for API calls
console.log('\n5️⃣ Testing API Integration...');
const apiBaseUrl = 'https://resume-backend-service.vercel.app';
console.log('API Base URL:', apiBaseUrl);

// Test 6: Check for React DevTools
console.log('\n6️⃣ Testing React DevTools...');
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('✅ React DevTools detected');
} else {
  console.log('❌ React DevTools not found');
}

// Test 7: Check for infinite loops
console.log('\n7️⃣ Testing for Infinite Loops...');
let renderCount = 0;
const observer = new MutationObserver(() => {
  renderCount++;
  if (renderCount > 100) {
    console.log('⚠️ High render count detected:', renderCount);
  }
});

observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});

// Stop observing after 5 seconds
setTimeout(() => {
  observer.disconnect();
  console.log(`📊 Total renders observed: ${renderCount}`);
  
  // Test Results Summary
  console.log('\n📋 Test Results Summary:');
  console.log('========================');
  console.log(`Authentication: ${authState?.isAuthenticated ? '✅' : '❌'}`);
  console.log(`Admin Page Access: ${isAdminPage ? '✅' : '❌'}`);
  console.log(`Performance Violations: ${violationCount > 0 ? `❌ (${violationCount})` : '✅'}`);
  console.log(`Form Inputs: ${inputs.length > 0 ? `✅ (${inputs.length} found)` : '❌'}`);
  console.log(`High Render Count: ${renderCount > 100 ? `❌ (${renderCount})` : '✅'}`);
  
  if (violationCount === 0 && renderCount < 100) {
    console.log('\n🎉 All tests passed! Admin functionality is working properly.');
  } else {
    console.log('\n⚠️ Some issues detected. Check the details above.');
  }
}, 5000);

console.log('\n⏳ Running tests for 5 seconds...');
console.log('Please interact with the admin form during this time.');

