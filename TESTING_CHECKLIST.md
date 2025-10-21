# Testing Checklist for Project Pages

## URLs to Test:

After updating backend with GitHub URLs, test these pages:

1. https://minaragaie.github.io/projects/turris-erp-frontend
2. https://minaragaie.github.io/projects/storyverse-app
3. https://minaragaie.github.io/projects/abgadya
4. https://minaragaie.github.io/projects/quaenet

---

## For Each Project Page:

### ✅ Content Loading
- [ ] Page loads without errors
- [ ] Portfolio content displays (from GitHub repo)
- [ ] Project title shows correctly
- [ ] Project metadata visible (technologies, year, status)
- [ ] Images/screenshots render properly

### ✅ Navigation
- [ ] Table of Contents appears on left sidebar
- [ ] TOC shows all headings correctly
- [ ] Search box in TOC works
- [ ] Typing in search filters headings
- [ ] Clicking TOC item scrolls to section
- [ ] Active section highlights in TOC when scrolling
- [ ] URL hash updates on scroll (#section-name)
- [ ] Collapsible TOC items work (expand/collapse)

### ✅ Content Features
- [ ] Markdown renders correctly (headings, lists, code, etc.)
- [ ] Code blocks have terminal-style UI
- [ ] Code blocks show language labels
- [ ] Copy button works in code blocks
- [ ] Syntax highlighting works
- [ ] Images display properly
- [ ] Links work correctly
- [ ] Tables render well (if any)
- [ ] Sections are collapsible
- [ ] Clicking heading collapses/expands content

### ✅ Interactive Elements
- [ ] Reading progress bar at top works
- [ ] Scroll to top button appears after scrolling down
- [ ] Scroll to top button scrolls smoothly to top
- [ ] Hover tooltip shows on scroll to top button
- [ ] Back button works (returns to project list)
- [ ] Print button works (Ctrl/Cmd + P)

### ✅ Comments Section
- [ ] Comments section visible at bottom
- [ ] Shows message about GitHub sign-in
- [ ] Link to GitHub repo shows correctly
- [ ] Giscus widget loads
- [ ] Can sign in with GitHub (if you test)
- [ ] Can post a comment (if you test)

### ✅ Responsive Design
- [ ] Desktop view (1920x1080) looks good
- [ ] Tablet view (768px) looks good
- [ ] Mobile view (375px) looks good
- [ ] TOC hides on mobile (or shows in menu)
- [ ] Code blocks scroll horizontally on mobile
- [ ] Tables responsive on mobile
- [ ] All buttons accessible on mobile

### ✅ Performance
- [ ] Page loads in < 2 seconds
- [ ] Smooth scrolling (no lag)
- [ ] TOC search responds instantly
- [ ] No console errors in browser DevTools
- [ ] No 404 errors for resources

### ✅ Theme Support
- [ ] Default theme applies correctly
- [ ] Switching themes updates project page
- [ ] Colors match overall site design
- [ ] Scroll to top button matches theme

### ✅ Print Mode
- [ ] Press Ctrl/Cmd + P
- [ ] All sections auto-expand
- [ ] Interactive elements hide
- [ ] Content formatted for printing
- [ ] Page breaks work well
- [ ] Black & white friendly

---

## Common Issues & Solutions:

### ❌ "Project not found"
- **Cause**: `githubUrl` in backend doesn't match or is missing
- **Fix**: Update backend resume.json with correct GitHub URL
- **Verify**: URL slug must match repo name exactly

### ❌ "Failed to load project portfolio"
- **Cause**: portfolio.md or PORTFOLIO.md doesn't exist in repo
- **Fix**: Add portfolio.md file to the repository
- **Verify**: File is in main or master branch

### ❌ Comments section shows "Comments not available"
- **Cause**: Project doesn't have githubUrl in backend
- **Fix**: Add githubUrl to project in resume.json

### ❌ Comments widget doesn't load
- **Cause**: Discussions not enabled in repository
- **Fix**: Enable Discussions in repo Settings → Features

### ❌ TOC doesn't highlight on scroll
- **Cause**: Browser cache or JavaScript error
- **Fix**: Hard refresh (Ctrl/Cmd + Shift + R)
- **Check**: Browser console for errors

### ❌ Images don't load
- **Cause**: Image URLs in portfolio.md are incorrect
- **Fix**: Use absolute URLs or relative to repo root
- **Example**: `![Image](./images/screenshot.png)`

---

## Browser Testing:

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## DevTools Checks:

### Console Tab
- [ ] No JavaScript errors
- [ ] No failed network requests
- [ ] Giscus loads successfully

### Network Tab
- [ ] portfolio.md fetches successfully (200 status)
- [ ] All images load (200 status)
- [ ] Giscus script loads (200 status)
- [ ] No 404 or 500 errors

### Performance Tab
- [ ] Page load < 2s
- [ ] Time to Interactive < 3s
- [ ] No layout shifts

---

## Accessibility Testing:

- [ ] Keyboard navigation works (Tab key)
- [ ] Screen reader friendly (test with VoiceOver/NVDA)
- [ ] All buttons have aria-labels
- [ ] Images have alt text
- [ ] Headings hierarchy is correct (h1 → h2 → h3)
- [ ] Color contrast meets WCAG AA

---

## Quick Test Script:

```bash
# Test 1: Check if portfolio.md exists
curl -I https://raw.githubusercontent.com/minaragaie/turris-erp-frontend/main/portfolio.md
# Should return: 200 OK

# Test 2: Check if discussions enabled
# Visit: https://github.com/minaragaie/turris-erp-frontend/discussions
# Should show discussions page, not 404

# Test 3: Verify backend API
curl https://resume-backend-service.vercel.app/api/admin?type=resume | jq '.projects[] | {name, githubUrl}'
# Should show all projects with GitHub URLs
```

---

## Sign-Off Checklist:

Before going live:
- [ ] All 4 project pages work
- [ ] Backend resume.json updated
- [ ] All repos have portfolio.md
- [ ] Discussions enabled on all repos
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Comments work (tested with one comment)
- [ ] Print mode works
- [ ] Performance is good

---

## 🎉 Success Criteria:

✅ All project pages load successfully  
✅ Content displays from GitHub repos  
✅ Navigation and TOC work perfectly  
✅ Comments are functional  
✅ Mobile responsive  
✅ No errors in console  

**Ready for production!** 🚀

