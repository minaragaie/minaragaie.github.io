const fs = require('fs');
const path = require('path');

// This script prepares the app for GitHub Pages deployment
// by replacing the admin page with a static version

console.log('🚀 Preparing for GitHub Pages deployment...');

// Read the current admin page
const adminPagePath = path.join(__dirname, '..', 'app', 'admin', 'page.tsx');
const adminPageExternalAPIPath = path.join(__dirname, '..', 'app', 'admin', 'page-external-api.tsx');

try {
  // Backup the original admin page
  const originalContent = fs.readFileSync(adminPagePath, 'utf8');
  const backupPath = path.join(__dirname, '..', 'app', 'admin', 'page-backup.tsx');
  fs.writeFileSync(backupPath, originalContent);
  console.log('✅ Backed up original admin page');

  // Replace with full AdminPage component (works with GitHub Pages via external API)
  const adminPageContent = `"use client"

import AdminPage from "@/components/admin/AdminPage"

export default function AdminPageRoute() {
  return <AdminPage />
}`;
  fs.writeFileSync(adminPagePath, adminPageContent);
  console.log('✅ Replaced admin page with full AdminPage component (GitHub Pages compatible via external API)');

  // Remove API routes (they won't work on GitHub Pages)
  const apiDir = path.join(__dirname, '..', 'app', 'api');
  if (fs.existsSync(apiDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true });
    console.log('✅ Removed API routes (not supported on GitHub Pages)');
  }

  console.log('🎉 Ready for GitHub Pages deployment!');
  console.log('📝 To restore full functionality, run: npm run restore-admin');
} catch (error) {
  console.error('❌ Error preparing for GitHub Pages:', error);
  process.exit(1);
}
