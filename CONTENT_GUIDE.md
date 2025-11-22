# Content Management Guide

This guide explains how to update all the content on your portfolio website through JSON files.

## 📁 File Structure

```
data/
├── about.json         # Hero, About, Skills, Contact, Resume
├── publications.json  # Research papers and publications
├── awards.json        # Awards and honors
├── projects.json      # All project cards
└── experience.json    # Work experience
```

---

## 🎯 `data/about.json`

This file controls:
- **Hero Section** (name & title)
- **About Section** (personal story paragraphs)
- **Skills Grid** (technical skills by category)
- **Contact Section** (contact links & description)
- **Resume Section** (description & file path)

### Structure:

```json
{
  "hero": {
    "name": {
      "firstName": "YOUR_FIRST_NAME",
      "lastName": "YOUR_LAST_NAME"
    },
    "title": "YOUR PROFESSIONAL TITLE"
  },
  "about": {
    "paragraphs": [
      "First paragraph of your story...",
      "Second paragraph...",
      "Third paragraph...",
      "Fourth paragraph..."
    ]
  },
  "skills": {
    "Category Name 1": ["Skill 1", "Skill 2", "Skill 3"],
    "Category Name 2": ["Skill A", "Skill B", "Skill C"],
    "Category Name 3": ["Tool 1", "Tool 2", "Tool 3"],
    "Category Name 4": ["Language 1", "Language 2", "Language 3"]
  },
  "contact": {
    "description": "Your contact section description",
    "links": [
      {
        "label": "EMAIL",
        "value": "your.email@example.com",
        "url": "mailto:your.email@example.com",
        "type": "email"
      },
      {
        "label": "GITHUB",
        "value": "github.com/yourusername",
        "url": "https://github.com/yourusername",
        "type": "link"
      }
    ]
  },
  "resume": {
    "description": "Resume section description",
    "buttonText": "DOWNLOAD RESUME",
    "file": "resume/YourResume.pdf"
  }
}
```

### How to Update:

1. **Change Your Name:**
   - Edit `hero.name.firstName` and `hero.name.lastName`

2. **Update Professional Title:**
   - Edit `hero.title`

3. **Modify About Paragraphs:**
   - Edit the array in `about.paragraphs`
   - Add or remove paragraphs as needed

4. **Update Skills:**
   - Add/remove skill categories
   - Add/remove individual skills within categories

5. **Change Contact Info:**
   - Update `contact.links` array
   - Add new contact methods or remove existing ones

6. **Update Resume:**
   - Change `resume.file` to point to your PDF file
   - Make sure the PDF exists in the `resume/` folder

---

## 📂 `data/projects.json`

This file controls all project cards in the "Selected Work" section.

### Structure:

```json
[
  {
    "title": "Project Name",
    "description": "Short description shown on card",
    "longDescription": "Detailed description (optional, shows with 'Read More' button)",
    "category": "Category Name",
    "year": "2024",
    "status": "Active",
    "image": "/images/projects/project1.jpg",
    "images": [
      "/images/projects/project1-1.jpg",
      "/images/projects/project1-2.jpg",
      "/images/projects/project1-3.jpg"
    ],
    "github": "https://github.com/username/repo",
    "demo": "https://demo-url.com",
    "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
  }
]
```

### Fields:

- **title** (required): Project name
- **description** (required): Brief description
- **longDescription** (optional): Extended description (shows with "Read More")
- **category** (optional): Project category badge
- **year** (optional): Year completed
- **status** (optional): "Active" or "Completed"
- **image** (optional): Single image path
- **images** (optional): Array of image paths (creates carousel)
- **github** (optional): GitHub repository URL
- **demo** (optional): Live demo URL
- **tags** (optional): Array of technology tags

### How to Update:

1. **Add New Project:**
   - Copy an existing project object
   - Paste at the desired position in the array
   - Update all fields

2. **Remove Project:**
   - Delete the entire project object (including curly braces)
   - Make sure to maintain proper JSON syntax (commas between objects)

3. **Reorder Projects:**
   - Cut and paste entire project objects
   - Projects appear in the order listed

4. **Add Image Carousel:**
   - Use `images` array instead of single `image`
   - Add 2+ images for carousel to appear

---

## 📚 `data/publications.json`

This file controls the publications section showing your research papers and technical contributions.

### Structure:

```json
[
  {
    "title": "Paper Title",
    "authors": ["Author 1", "Author 2", "Author 3"],
    "venue": "Conference/Journal Name",
    "year": "2024",
    "type": "Conference",
    "status": "Published",
    "abstract": "Brief description of the paper and its contributions...",
    "pdf": "https://link-to-pdf.com",
    "arxiv": "https://arxiv.org/abs/xxxxx",
    "code": "https://github.com/username/repo",
    "tags": ["Tag1", "Tag2", "Tag3"]
  }
]
```

### Fields:

- **title** (required): Paper title
- **authors** (required): Array of author names (your name should be included)
- **venue** (required): Conference/journal name (full name preferred)
- **year** (required): Publication year
- **type** (optional): "Conference", "Journal", "Workshop", "Preprint"
- **status** (optional): "Published", "Under Review", "Accepted"
- **abstract** (required): Brief paper description
- **pdf** (optional): Link to PDF file
- **arxiv** (optional): arXiv link
- **code** (optional): GitHub repository link
- **tags** (optional): Array of research topics/keywords

### How to Update:

1. **Add New Publication:**
   - Copy an existing publication object
   - Add at the top of the array for reverse chronological order
   - Update all fields with your paper information

2. **Update Publication Status:**
   - Change `status` from "Under Review" to "Published"
   - Update venue information if it changed

3. **Add Links:**
   - Add `pdf`, `arxiv`, or `code` URLs as they become available
   - All link fields are optional

4. **Format Author Names:**
   - Use full names or initials consistently
   - Your name can be anywhere in the author list

### Examples:

**Conference Paper:**
```json
{
  "title": "Neural Rendering at 60 FPS",
  "authors": ["Your Name", "Co-Author"],
  "venue": "ACM SIGGRAPH 2024",
  "year": "2024",
  "type": "Conference",
  "status": "Published",
  "abstract": "We present...",
  "pdf": "https://dl.acm.org/...",
  "code": "https://github.com/...",
  "tags": ["Neural Rendering", "Real-time"]
}
```

**Preprint/Under Review:**
```json
{
  "title": "Work in Progress Title",
  "authors": ["Your Name"],
  "venue": "arXiv preprint",
  "year": "2024",
  "type": "Preprint",
  "status": "Under Review",
  "abstract": "This work...",
  "arxiv": "https://arxiv.org/abs/...",
  "tags": ["GPU", "Optimization"]
}
```

---

## 🏆 `data/awards.json`

This file controls the awards and honors section.

### Structure:

```json
[
  {
    "title": "Award Name",
    "organization": "Organization/Institution Name",
    "date": "Month Year",
    "description": "Brief description of the award and why you received it.",
    "category": "Category Type"
  }
]
```

### Fields:

- **title** (required): Award name
- **organization** (required): Organization that gave the award
- **date** (required): Date received (e.g., "December 2024", "2023-2024")
- **description** (required): Brief description of the award
- **category** (optional): "Research", "Fellowship", "Academic", "Innovation", "Service"

### How to Update:

1. **Add New Award:**
   - Copy an existing award object
   - Add at the top for reverse chronological order
   - Update all fields

2. **Award Categories:**
   - Use consistent categories for similar awards
   - Categories affect the badge color display

3. **Date Formats:**
   - Use "Month Year" for specific dates
   - Use "Year-Year" for date ranges
   - Use "Year" for single-year awards

### Examples:

**Research Award:**
```json
{
  "title": "Best Paper Award",
  "organization": "IEEE Conference on Computer Vision",
  "date": "December 2024",
  "description": "Recognized for outstanding research contribution.",
  "category": "Research"
}
```

**Fellowship:**
```json
{
  "title": "Graduate Research Fellowship",
  "organization": "National Science Foundation",
  "date": "2023-2025",
  "description": "Competitive fellowship for doctoral research.",
  "category": "Fellowship"
}
```

**Academic Honor:**
```json
{
  "title": "Dean's List",
  "organization": "Your University",
  "date": "2022-2024",
  "description": "Outstanding academic performance.",
  "category": "Academic"
}
```

---

## 💼 `data/experience.json`

This file controls the experience section.

### Structure:

```json
[
  {
    "title": "Job Title",
    "company": "Company Name",
    "date": "Jan 2020 - Dec 2022",
    "description": "Job description and responsibilities...",
    "technologies": ["Tech1", "Tech2", "Tech3"],
    "projects": [
      {
        "title": "Project Name",
        "year": "2022",
        "description": "Project description...",
        "github": "https://github.com/username/repo",
        "demo": "https://demo-url.com"
      }
    ]
  }
]
```

### Fields:

- **title** (required): Job title
- **company** (required): Company name
- **date** (required): Employment dates
- **description** (required): Job description
- **technologies** (optional): Array of technologies used
- **projects** (optional): Array of key projects

### How to Update:

1. **Add New Experience:**
   - Copy an existing experience object
   - Add at the top of the array for reverse chronological order

2. **Add Project Under Experience:**
   - Add to the `projects` array
   - Include title, year, description, and optional links

---

## 🎨 Images

### Project Images:

1. Place images in `images/projects/` folder
2. Reference them in JSON as: `/images/projects/filename.jpg`
3. Recommended size: 1200x800px or similar aspect ratio

### Image Formats:
- JPG/JPEG for photos
- PNG for graphics with transparency
- WebP for modern browsers (smaller file size)

---

## 🚀 Quick Update Workflow

### To Update Your About Story:
1. Open `data/about.json`
2. Find `"about": { "paragraphs": [ ... ] }`
3. Edit the paragraph text
4. Save the file
5. Refresh your website

### To Add a New Project:
1. Open `data/projects.json`
2. Add image(s) to `images/projects/`
3. Copy an existing project structure
4. Update all fields
5. Save and refresh

### To Add a Publication:
1. Open `data/publications.json`
2. Copy an existing publication structure
3. Add at the top of the array
4. Update title, authors, venue, abstract, and links
5. Save and refresh

### To Add an Award:
1. Open `data/awards.json`
2. Copy an existing award structure
3. Add at the top of the array
4. Update title, organization, date, and description
5. Save and refresh

### To Update Contact Info:
1. Open `data/about.json`
2. Find `"contact": { "links": [ ... ] }`
3. Update URLs and values
4. Save and refresh

---

## ⚠️ Important Notes

1. **JSON Syntax:**
   - Always use double quotes `"` for strings
   - Remember commas between array items
   - No comma after last item in array/object
   - Use [JSONLint](https://jsonlint.com/) to validate

2. **File Paths:**
   - Use forward slashes `/` (not backslashes `\`)
   - Start with `/` for absolute paths from root
   - Example: `/images/projects/my-project.jpg`

3. **Special Characters:**
   - Escape quotes inside strings: `\"` 
   - For line breaks in descriptions, use actual line breaks
   - Be careful with apostrophes in text

4. **Testing:**
   - Always test locally after changes
   - Check browser console for errors (F12)
   - Validate JSON syntax before deploying

---

## 🆘 Troubleshooting

### Content Not Updating?
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors (F12)
- Validate JSON syntax at jsonlint.com

### Images Not Loading?
- Check file path is correct
- Ensure image exists in `images/projects/`
- Check file name spelling and case sensitivity

### JSON Errors?
- Check for missing commas or quotes
- Use a JSON validator
- Compare with working examples

---

## 📝 Examples

See the existing JSON files for complete working examples:
- `about.json` - Hero, about, skills, contact, resume
- `publications.json` - Research papers and publications
- `awards.json` - Awards and honors
- `projects.json` - Project portfolio
- `experience.json` - Work experience

---

**Happy updating! 🎉**

If you need help, check the browser console (F12) for error messages.

