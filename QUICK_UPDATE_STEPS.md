# 🚀 Quick Update Steps

## What You Need to Do

### Step 1: Update Your Backend Resume Data

1. Open your backend repository at: `/resume-backend-service/data/resume.json`

2. Add the `projects` field to each experience entry:

```json
{
  "experience": [
    {
      "id": 1,
      "company": "Turris Group",
      "title": "Full Stack Developer",
      // ... other fields ...
      "projects": ["turris-erp"]  // ← ADD THIS LINE
    },
    {
      "id": 2,
      "company": "Freelance / Personal Projects",
      "title": "Independent Full Stack Developer",
      // ... other fields ...
      "projects": ["storyverse", "abgadya", "entityconnect"]  // ← ADD THIS LINE
    }
  ]
}
```

### Step 2: Key Points

- ✅ The `projects` array contains **project slugs** (not names)
- ✅ Make sure the slugs match your projects' `slug` field
- ✅ Multiple projects per experience are supported
- ✅ If an experience has no projects, you can omit the `projects` field

### Step 3: Deploy Backend

```bash
cd /resume-backend-service
vercel --prod
```

## 📋 Example Mapping

| Experience | Projects |
|-----------|----------|
| Turris Group | `["turris-erp"]` |
| Freelance | `["storyverse", "abgadya", "entityconnect"]` |

## 🎨 What Will Show

### On Experience Cards:
```
// Projects Built During This Role
┌──────────────┐ ┌──────────────┐
│ Turris ERP   │ │ StoryVerse   │
└──────────────┘ └──────────────┘
     (clickable links to project pages)
```

### On Project Cards:
```
Turris ERP
Production • 2023 • @ Turris Group
              ↑
        company badge
```

## ✅ Test It

After deploying:
1. Visit your portfolio
2. Check Experience section - should show project badges
3. Check Projects section - should show company names
4. Click project badges - should navigate to project details

---

## 📄 Full Example

See `RESUME_JSON_UPDATE_EXAMPLE.json` for a complete working example with all fields populated.

