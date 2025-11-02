# Backend Update: Project-Experience Relationship

## 🎯 What Changed

We've added a relationship between **Experience (Companies)** and **Projects** to show which projects were built during each role.

## 📝 How to Update Your Backend

In your backend repo: `https://github.com/minaragaie/resume-backend-service`

**File to update**: `data/resume.json`

---

## 🔗 Adding Project References to Experience

For each experience entry, add a `projects` array containing the **slugs** of projects built during that role.

### Example Structure:

```json
{
  "experience": [
    {
      "id": 1,
      "company": "Turris Group",
      "title": "Full Stack Developer",
      "startDate": "January 2023",
      "endDate": "Present",
      "description": "Leading development of enterprise solutions",
      "technologies": ["Angular", "Node.js", "PostgreSQL"],
      "achievements": [
        "Built ERP system serving 500+ users",
        "Reduced system latency by 40%"
      ],
      "projects": ["turris-erp"]  // ← ADD THIS: Array of project slugs
    },
    {
      "id": 2,
      "company": "Freelance",
      "title": "Independent Developer",
      "startDate": "2022",
      "endDate": "2023",
      "description": "Building innovative solutions",
      "technologies": ["React", "React Native", "MongoDB"],
      "achievements": [
        "Developed multiple full-stack applications",
        "Managed end-to-end project lifecycles"
      ],
      "projects": ["storyverse", "abgadya", "entityconnect"]  // ← Multiple projects
    }
  ]
}
```

---

## 📋 Project Slugs Reference

Make sure your project slugs in the `projects` array match the `slug` field in your projects:

```json
{
  "projects": [
    {
      "id": 1,
      "name": "Turris ERP",
      "slug": "turris-erp",  // ← This slug
      "description": "Enterprise Resource Planning System",
      "status": "Production",
      "year": "2023"
    },
    {
      "id": 2,
      "name": "StoryVerse",
      "slug": "storyverse",  // ← This slug
      "description": "AI-powered storytelling platform",
      "status": "Production",
      "year": "2024"
    }
  ]
}
```

---

## 🎨 What This Enables

### In Experience Section:
- Shows clickable project badges under each role
- "Projects Built During This Role" section
- Links directly to project detail pages

### In Projects Section:
- Shows company badge on each project card
- "@ Company Name" indicator
- Clear connection between work and projects

---

## 📐 Complete Example

```json
{
  "experience": [
    {
      "id": 1,
      "company": "Turris Group",
      "title": "Full Stack Developer",
      "startDate": "January 2023",
      "endDate": "Present",
      "description": "Leading enterprise software development",
      "technologies": ["Angular", "Node.js", "PostgreSQL", "Redis"],
      "achievements": [
        "Architected ERP system for workforce management",
        "Improved system performance by 40%"
      ],
      "projects": ["turris-erp"]
    },
    {
      "id": 2,
      "company": "Freelance",
      "title": "Independent Developer",
      "startDate": "2022",
      "endDate": "2023",
      "description": "Full-stack development and consulting",
      "technologies": ["React", "React Native", "Node.js", "MongoDB"],
      "achievements": [
        "Delivered 5+ production applications",
        "Managed complete project lifecycles"
      ],
      "projects": ["storyverse", "abgadya", "entityconnect"]
    }
  ],
  "projects": [
    {
      "id": 1,
      "name": "Turris ERP",
      "slug": "turris-erp",
      "description": "Enterprise Resource Planning System",
      "technologies": ["Angular 15", "Node.js", "PostgreSQL"],
      "status": "Production",
      "year": "2023",
      "icon": "Building2",
      "color": "from-blue-500 to-blue-700"
    },
    {
      "id": 2,
      "name": "StoryVerse",
      "slug": "storyverse",
      "description": "AI-powered storytelling platform",
      "technologies": ["React Native", "Node.js", "OpenAI"],
      "status": "Production",
      "year": "2024",
      "icon": "BookOpen",
      "color": "from-purple-500 to-purple-700"
    },
    {
      "id": 3,
      "name": "Abgadya",
      "slug": "abgadya",
      "description": "Arabic language learning platform",
      "technologies": ["React", "Express", "PostgreSQL"],
      "status": "Active",
      "year": "2023",
      "icon": "GraduationCap",
      "color": "from-green-500 to-green-700"
    },
    {
      "id": 4,
      "name": "EntityConnect",
      "slug": "entityconnect",
      "description": "Church community management platform",
      "technologies": ["Angular 13", "Sails.js", "MySQL"],
      "status": "Production",
      "year": "2022",
      "icon": "Users",
      "color": "from-amber-500 to-amber-700"
    }
  ]
}
```

---

## ✅ After Updating

1. Save your `resume.json` file
2. Deploy to Vercel: `vercel --prod`
3. Your frontend will automatically fetch and display the relationships
4. Test by viewing:
   - Experience section (should show project badges)
   - Projects section (should show company badges)

---

## 🔍 Notes

- The `projects` field in experience is **optional** - experiences without projects won't break
- If a project slug doesn't match any project, it will be silently skipped
- Projects without an experience reference won't show a company badge (that's fine for personal projects)
- Multiple experiences can reference the same project if it spanned multiple roles

---

## 🎯 Benefits

✅ **Better Context**: Visitors see what you built at each company  
✅ **Easy Navigation**: Click project badges to see details  
✅ **Professional**: Shows clear connection between roles and deliverables  
✅ **Flexible**: Works with any number of projects per role

