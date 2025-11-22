# Deployment Guide

This guide explains how to deploy your portfolio website to production.

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites:
- GitHub account
- Vercel account (free tier available at [vercel.com](https://vercel.com))

### Steps:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it as a static site
   - Click "Deploy"
   - Done! Your site will be live at `your-project.vercel.app`

3. **Custom Domain (Optional):**
   - In Vercel dashboard, go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

---

## 📁 Pre-Deployment Checklist

### ✅ Content Review:
- [ ] Update `data/about.json` with your info
- [ ] Update `data/experience.json` with your work history
- [ ] Update `data/projects.json` with your projects
- [ ] Update `data/publications.json` with your papers (if any)
- [ ] Update `data/awards.json` with your honors
- [ ] Update resume PDF in `resume/` folder
- [ ] Test all external links (GitHub, LinkedIn, etc.)

### ✅ Images (Optional - Add Later):
- [ ] Project images go in `images/projects/`
- [ ] Add `"images": ["path/to/image.jpg"]` to projects in `data/projects.json`
- [ ] Recommended size: 1200x800px
- [ ] Formats: JPG, PNG, or WebP
- [ ] Projects without images will display with text only (no placeholders)

### ✅ Technical:
- [ ] All JSON files are valid (use [JSONLint](https://jsonlint.com/))
- [ ] Resume PDF exists and filename matches `data/about.json`
- [ ] Test locally with `python server.py` or `npx serve`
- [ ] Check browser console for errors (F12)

---

## 🖥️ Local Testing

### Option 1: Python Server
```bash
python server.py
```
Then open http://localhost:8000

### Option 2: Node.js Serve
```bash
npx serve
```

### Option 3: Live Server (VS Code)
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

---

## 🌐 Alternative Deployment Options

### GitHub Pages:

1. **Create `gh-pages` branch:**
   ```bash
   git checkout -b gh-pages
   git push origin gh-pages
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select `gh-pages` branch
   - Your site will be at `https://yourusername.github.io/repo-name`

3. **Note:** Update paths in code to use relative paths if needed

### Netlify:

1. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Drag & drop your project folder
   - Or connect to GitHub repository

2. **Configure:**
   - Build command: (none)
   - Publish directory: `.` (root)
   - Deploy!

### Cloudflare Pages:

1. **Deploy:**
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Connect GitHub repository
   - Configure build settings:
     - Build command: (none)
     - Build output directory: `.` (root)

---

## 🔧 Configuration Files

### `vercel.json`
Already configured with:
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- JSON content type headers
- PDF download headers
- Caching for static assets

No changes needed unless you want custom routing.

### `.gitignore` (Create if needed)
```
node_modules/
.DS_Store
.vercel
*.log
.env
```

---

## 📝 Post-Deployment Tasks

### 1. **Test Everything:**
- [ ] All sections load correctly
- [ ] All animations work
- [ ] Navigation works
- [ ] Chain navigation works
- [ ] Resume downloads
- [ ] External links open in new tabs
- [ ] Mobile responsive
- [ ] All JSON data displays correctly

### 2. **Performance Check:**
- Use [Google PageSpeed Insights](https://pagespeed.web.dev/)
- Check [GTmetrix](https://gtmetrix.com/)
- Optimize images if needed (use WebP format)

### 3. **SEO (Optional):**
Update `index.html` meta tags:
```html
<meta name="description" content="Your description here">
<meta property="og:title" content="Your Name - Portfolio">
<meta property="og:description" content="Your description">
<meta property="og:image" content="https://yoursite.com/preview.jpg">
<meta name="twitter:card" content="summary_large_image">
```

### 4. **Analytics (Optional):**
Add Google Analytics or Plausible to track visitors:
```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
```

---

## 🐛 Troubleshooting

### JSON Not Loading:
- Check browser console (F12) for errors
- Validate JSON syntax at [JSONLint](https://jsonlint.com/)
- Ensure file paths use forward slashes `/`
- Clear browser cache (Ctrl+Shift+R)

### Images Not Showing:
- Check file paths are correct
- Ensure images exist in `images/projects/`
- Check file name spelling and case sensitivity
- Images should use forward slashes: `/images/projects/name.jpg`

### Resume Not Downloading:
- Ensure PDF exists in `resume/` folder
- Check filename matches `data/about.json`
- File path should be: `resume/YourName.pdf`

### Site Not Updating:
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check deployment logs in hosting dashboard
- Verify git push succeeded
- Check file changes were committed

### 3D Chain Not Visible:
- Check browser supports WebGL
- Open browser console for errors
- Try different browser (Chrome/Firefox recommended)
- Ensure Three.js CDN is accessible

---

## 📊 Monitoring

### Vercel Analytics:
- Built-in analytics available in Vercel dashboard
- Shows page views, visitors, and performance

### Uptime Monitoring:
- Use [UptimeRobot](https://uptimerobot.com/) (free)
- Get notified if site goes down

---

## 🔄 Updating Content After Deployment

### Quick Updates:
1. Edit JSON files in `data/` folder
2. Commit changes: `git commit -am "Update content"`
3. Push: `git push`
4. Vercel auto-deploys in ~30 seconds

### Adding Images Later:
1. Add images to `images/projects/`
2. Update `data/projects.json` to include image paths:
   ```json
   "images": ["/images/projects/project1.jpg"]
   ```
3. Commit and push

---

## 🚨 Important Notes

1. **Never commit sensitive data** (API keys, passwords, etc.)
2. **Always test locally** before deploying
3. **Keep backups** of your content JSON files
4. **Use version control** (git) for all changes
5. **Check mobile responsiveness** after major updates

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Validate JSON files
3. Review deployment logs
4. Test locally first
5. Check `CONTENT_GUIDE.md` for content help

---

## 🎉 You're Ready to Deploy!

Your portfolio is configured for deployment. Just push to GitHub and deploy with Vercel (or your preferred platform). Projects without images will display as text-only cards, so you can deploy now and add images later without any code changes.

**Happy deploying! 🚀**

