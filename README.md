# Personal Portfolio Website

A modern, interactive portfolio website featuring 3D graphics, smooth animations, and dynamic content management.

## ✨ Features

- **Interactive 3D Chain Navigation** - Clickable 3D chain links for section navigation
- **Dynamic Content** - All content managed through JSON files
- **Smooth Animations** - Glassmorphic cards with purple glow effects
- **Sections:**
  - About (with skills grid)
  - Experience (work history)
  - Projects (portfolio)
  - Publications (research papers)
  - Awards & Honors
  - Resume (download)
  - Contact

## 🚀 Quick Start

### Local Development:

**Option 1: Python**
```bash
python server.py
# Open http://localhost:8000
```

**Option 2: Node.js**
```bash
npx serve
# Follow terminal instructions
```

**Option 3: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

## 📝 Updating Content

All content is managed through JSON files in the `data/` folder:

### `data/about.json`
- Hero section (name & title)
- About paragraphs
- Skills grid
- Contact information
- Resume details

### `data/experience.json`
- Work experience
- Job descriptions
- Technologies used

### `data/projects.json`
- Project cards
- Descriptions
- GitHub/demo links
- Tags

### `data/publications.json`
- Research papers
- Authors & venues
- PDF/arXiv/code links

### `data/awards.json`
- Awards & honors
- Organizations
- Descriptions

See `CONTENT_GUIDE.md` for detailed instructions on updating content.

## 🎨 Adding Images

Images are optional. Projects without images will display with text-only cards (no placeholders). To add images:

1. Add images to `images/projects/` folder
2. Update `data/projects.json`:
   ```json
   {
     "title": "Project Name",
     "images": ["/images/projects/image1.jpg"],
     ...
   }
   ```
3. Projects with images will show them in a carousel (if multiple) or single image

## 🌐 Deployment

See `DEPLOYMENT.md` for complete deployment instructions.

### Quick Deploy to Vercel:
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy (auto-detects as static site)

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **3D Graphics:** Three.js
- **Animations:** CSS animations, GSAP-style easing
- **Design:** Glassmorphism, purple accent color scheme
- **Data:** JSON-based content management

## 📁 Project Structure

```
├── data/                   # JSON content files
│   ├── about.json
│   ├── awards.json
│   ├── experience.json
│   ├── projects.json
│   └── publications.json
├── images/                 # Image assets
│   └── projects/
├── js/                     # JavaScript modules
│   ├── modules/           # Feature modules
│   ├── app.js             # Main application
│   └── utils.js           # Utility functions
├── styles/                # Additional styles
├── resume/                # Resume PDF
├── index.html             # Main HTML file
├── styles.css             # Main stylesheet
├── vercel.json            # Vercel configuration
├── CONTENT_GUIDE.md       # Content update guide
└── DEPLOYMENT.md          # Deployment guide
```

## 🎯 Key Features Explained

### 3D Interactive Chain
- 6 clickable chain links
- Each link navigates to a section
- Hover effects with purple glow
- Physics-based animations

### Dynamic Content Loading
- All text content loads from JSON
- Easy to update without touching code
- Automatic card generation
- Projects without images show text-only cards

### Glassmorphic Design
- Frosted glass effect cards
- Purple accent colors (#4B00FF)
- Smooth hover animations
- Light switch effect on hover

## 🔧 Configuration

### Security Headers (vercel.json)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection

### Caching
- JSON files: 1 hour cache
- Static assets: 1 year cache
- Resume: Download attachment

## 📱 Responsive Design

Fully responsive across:
- Desktop (1920px+)
- Laptop (1440px)
- Tablet (768px)
- Mobile (375px+)

## 🐛 Troubleshooting

### Content Not Loading?
- Validate JSON at [JSONLint](https://jsonlint.com/)
- Check browser console (F12)
- Clear cache (Ctrl+Shift+R)

### 3D Effects Not Working?
- Ensure browser supports WebGL
- Check Three.js CDN is accessible
- Try Chrome or Firefox

See `DEPLOYMENT.md` for more troubleshooting tips.

## 📄 License

Personal portfolio website - All rights reserved.

## 👤 Author

**Satrajit Ghosh**
- GitHub: [@satrajitghosh183](https://github.com/satrajitghosh183)
- LinkedIn: [satrajit-ghosh](https://linkedin.com/in/satrajit-ghosh)
- Email: satrajit.ghosh@rutgers.edu

---

Built with 💜 using Three.js, vanilla JavaScript, and lots of purple glow effects.

---

**Note:** Project cards display without images by default. Add images to `data/projects.json` when ready.

