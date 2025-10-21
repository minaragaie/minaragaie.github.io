# Backend Projects Update Instructions

## 🎯 What to Update

In your backend repo: `https://github.com/minaragaie/resume-backend-service`

**File to update**: `data/resume.json`

---

## 📝 Projects Section to Add/Update

Find the `"projects"` array in your `data/resume.json` and replace it with this:

```json
{
  "projects": [
    {
      "id": 1,
      "name": "Turris ERP",
      "description": "Enterprise Resource Planning System for construction and telecommunications workforce management",
      "githubUrl": "https://github.com/minaragaie/turris-erp-frontend",
      "status": "Production",
      "year": "2023",
      "technologies": ["Angular 15", "Node.js", "PostgreSQL", "Redis", "DevExtreme"],
      "featured": true,
      "icon": "🏗️",
      "color": "#3b82f6"
    },
    {
      "id": 2,
      "name": "StoryVerse",
      "description": "AI-powered interactive storytelling platform with collaborative features",
      "githubUrl": "https://github.com/minaragaie/storyverse-app",
      "status": "Production",
      "year": "2024",
      "technologies": ["React Native", "Node.js", "MongoDB", "OpenAI"],
      "featured": true,
      "icon": "📚",
      "color": "#8b5cf6"
    },
    {
      "id": 3,
      "name": "Abgadya",
      "description": "Educational platform for Arabic language learning",
      "githubUrl": "https://github.com/minaragaie/abgadya",
      "status": "Active",
      "year": "2023",
      "technologies": ["React", "Express", "PostgreSQL"],
      "featured": true,
      "icon": "📖",
      "color": "#10b981"
    },
    {
      "id": 4,
      "name": "EntityConnect",
      "description": "Church community management platform (Quaenet monorepo)",
      "githubUrl": "https://github.com/minaragaie/quaenet",
      "status": "Production",
      "year": "2022",
      "technologies": ["Angular 13", "Sails.js", "React Native", "MySQL"],
      "featured": true,
      "icon": "⛪",
      "color": "#f59e0b"
    }
  ]
}
```

---

## ⚠️ Important Notes:

1. **Remove `detailsFile` field** - No longer needed
2. **`githubUrl` is REQUIRED** - Portfolio pages won't work without it
3. **Repo name in URL must match slug**:
   - URL: `/projects/turris-erp-frontend` → Repo: `minaragaie/turris-erp-frontend`
   - URL: `/projects/storyverse-app` → Repo: `minaragaie/storyverse-app`
   - URL: `/projects/abgadya` → Repo: `minaragaie/abgadya`
   - URL: `/projects/quaenet` → Repo: `minaragaie/quaenet`

---

## 🚀 Quick Update Steps:

### Option 1: Direct File Edit (Easiest)
1. Go to: https://github.com/minaragaie/resume-backend-service
2. Navigate to `data/resume.json`
3. Click **Edit** (pencil icon)
4. Update the `projects` array with the JSON above
5. Commit: "Update projects with GitHub URLs for portfolio.md integration"
6. Wait 1-2 minutes for Vercel to redeploy

### Option 2: Via Git (If you have it cloned)
```bash
cd ~/path/to/resume-backend-service
# Edit data/resume.json (update projects array)
git add data/resume.json
git commit -m "feat: Add GitHub URLs to projects for portfolio.md integration"
git push origin main
```

---

## ✅ After Update:

Your portfolio will automatically:
1. Fetch projects from backend API
2. Extract repo name from `githubUrl`
3. Fetch `portfolio.md` from that repo
4. Display with all features (TOC, comments, etc.)

---

## 🧪 Test Immediately:

After pushing to backend, wait 1-2 minutes, then:

```bash
# Test backend API
curl https://resume-backend-service-n8hcyohlp-minaragaie89-8717s-projects.vercel.app/api/admin?type=resume | jq '.data.projects'

# Should return projects with githubUrl fields
```

Then visit:
- http://localhost:3000/projects/turris-erp-frontend
- http://localhost:3000/projects/storyverse-app
- http://localhost:3000/projects/abgadya
- http://localhost:3000/projects/quaenet

**Should work immediately!** 🎉

