# Enable GitHub Discussions for Comments

Follow these steps for **each project repository**:

## Repositories to Enable:

- [ ] `minaragaie/turris-erp-frontend`
- [ ] `minaragaie/storyverse-app`
- [ ] `minaragaie/abgadya`
- [ ] `minaragaie/quaenet`

---

## Steps (Repeat for Each Repo):

### 1. Navigate to Repository
Go to: `https://github.com/minaragaie/{repo-name}`

### 2. Open Settings
- Click on **Settings** tab (top navigation)
- You need admin access to the repository

### 3. Enable Discussions
- Scroll down to the **Features** section
- Find **Discussions** checkbox
- Check ✅ the box to enable

### 4. Configure Discussions (Optional)
After enabling, you can:
- Create categories (General, Q&A, Ideas, etc.)
- Set up welcome messages
- Configure permissions

### 5. Verify
- Go to the **Discussions** tab
- You should see the discussions page
- Giscus will now work automatically on your portfolio site!

---

## Quick Links:

### Turris ERP Frontend
1. Settings: https://github.com/minaragaie/turris-erp-frontend/settings
2. Enable Discussions in Features section

### StoryVerse App
1. Settings: https://github.com/minaragaie/storyverse-app/settings
2. Enable Discussions in Features section

### Abgadya
1. Settings: https://github.com/minaragaie/abgadya/settings
2. Enable Discussions in Features section

### Quaenet (EntityConnect)
1. Settings: https://github.com/minaragaie/quaenet/settings
2. Enable Discussions in Features section

---

## After Enabling:

Comments will automatically work on your portfolio:
- `minaragaie.github.io/projects/turris-erp-frontend` → Comments in turris-erp-frontend repo
- `minaragaie.github.io/projects/storyverse-app` → Comments in storyverse-app repo
- `minaragaie.github.io/projects/abgadya` → Comments in abgadya repo
- `minaragaie.github.io/projects/quaenet` → Comments in quaenet repo

---

## Troubleshooting:

**If comments don't appear:**
1. Check if Discussions are enabled in repo Settings
2. Verify repo is public (or add GitHub token for private repos)
3. Check browser console for Giscus errors
4. Ensure `githubUrl` in backend matches exactly

**If you see "Comments not available":**
- This means the project doesn't have a `githubUrl` in resume.json
- Update backend with correct GitHub URL

---

## Note:
Once enabled, visitors can comment by:
1. Signing in with their GitHub account
2. Writing a comment
3. Submitting (creates a discussion in your repo)
4. You receive email notifications
5. You can reply/moderate from GitHub

✅ **Simple, free, and integrated with GitHub!**

