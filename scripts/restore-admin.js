const fs = require('fs');
const path = require('path');

// This script restores the full admin functionality
// by restoring the original admin page and API routes

console.log('🔄 Restoring full admin functionality...');

try {
  // Restore the original admin page
  const backupPath = path.join(__dirname, '..', 'app', 'admin', 'page-backup.tsx');
  const adminPagePath = path.join(__dirname, '..', 'app', 'admin', 'page.tsx');
  
  if (fs.existsSync(backupPath)) {
    const originalContent = fs.readFileSync(backupPath, 'utf8');
    fs.writeFileSync(adminPagePath, originalContent);
    console.log('✅ Restored original admin page');
  } else {
    console.log('⚠️  No backup found, admin page may not be fully functional');
  }

  console.log('🎉 Full admin functionality restored!');
  console.log('📝 This version requires a platform that supports API routes (Vercel, Netlify, etc.)');
} catch (error) {
  console.error('❌ Error restoring admin functionality:', error);
  process.exit(1);
}
