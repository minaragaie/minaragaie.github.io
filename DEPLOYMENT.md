# 🚀 Deployment Guide

This project can be deployed to different platforms with varying levels of functionality.

## 📊 Platform Comparison

| Platform | Admin Panel | API Routes | Cost | Ease |
|----------|-------------|------------|------|------|
| **GitHub Pages** | ❌ Static Only | ❌ Not Supported | Free | ⭐⭐⭐⭐⭐ |
| **Vercel** | ✅ Full Functionality | ✅ Supported | Free/Paid | ⭐⭐⭐⭐⭐ |
| **Netlify** | ✅ Full Functionality | ✅ Serverless Functions | Free/Paid | ⭐⭐⭐⭐ |
| **Railway** | ✅ Full Functionality | ✅ Full Stack | Free/Paid | ⭐⭐⭐ |

## 🎯 GitHub Pages Deployment (Static Only)

### What Works:
- ✅ Resume display
- ✅ Contact form (with external email service)
- ✅ All UI components
- ❌ Admin panel (replaced with info page)

### Steps:
```bash
# 1. Prepare for GitHub Pages (removes admin functionality)
npm run build:github

# 2. Deploy to GitHub Pages
npm run deploy:github

# 3. Restore admin functionality for local development
npm run restore-admin
```

### Features:
- **Static Resume**: Your resume displays perfectly
- **Contact Form**: Works with external email services
- **Responsive Design**: All UI components work
- **No Admin Panel**: Replaced with deployment notice

## 🔥 Vercel Deployment (Full Functionality)

### What Works:
- ✅ Complete admin panel
- ✅ All CRUD operations
- ✅ API routes
- ✅ File system access

### Steps:
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Follow the prompts
```

### Features:
- **Full Admin Panel**: Complete CRUD functionality
- **API Routes**: All backend operations work
- **Real-time Updates**: Changes persist immediately
- **Free Tier**: Generous free limits

## 🌐 Netlify Deployment (Full Functionality)

### What Works:
- ✅ Complete admin panel
- ✅ Serverless functions
- ✅ API routes

### Steps:
```bash
# 1. Build the project
npm run build

# 2. Deploy to Netlify
# - Connect your GitHub repo
# - Set build command: npm run build
# - Set publish directory: out
```

## 🚂 Railway Deployment (Full Functionality)

### What Works:
- ✅ Complete admin panel
- ✅ Full stack support
- ✅ Database support (if needed)

### Steps:
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
railway init
railway up
```

## 🔧 Development vs Production

### Local Development:
```bash
# Full functionality with admin panel
npm run dev
```

### GitHub Pages Production:
```bash
# Static version without admin panel
npm run build:github
npm run deploy:github
```

### Full-Stack Production (Vercel/Netlify):
```bash
# Full functionality
npm run build
# Deploy to your chosen platform
```

## 📝 Environment Variables

For full functionality, you may need these environment variables:

```env
# For contact form (if using Resend)
RESEND_API_KEY=your_resend_api_key

# For other email services
EMAIL_SERVICE_API_KEY=your_api_key
```

## 🎨 Customization

### For GitHub Pages:
- Admin panel shows deployment notice
- All other functionality works normally
- Resume data is static (edit `data/resume.json` directly)

### For Full-Stack Platforms:
- Complete admin panel functionality
- Real-time data updates
- Full CRUD operations

## 🚨 Important Notes

1. **GitHub Pages**: Only static files, no server-side code
2. **Vercel**: Best for Next.js apps with full functionality
3. **Netlify**: Good alternative with serverless functions
4. **Railway**: Full-stack platform with database support

## 🔄 Switching Between Deployments

```bash
# Switch to GitHub Pages mode
npm run build:github

# Switch back to full functionality
npm run restore-admin
```

Choose the deployment method that best fits your needs!
