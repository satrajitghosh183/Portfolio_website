// ============================================
// MAIN APP
// Initializes all components and manages render loop
// ============================================

class App {
  constructor() {
    this.loader = null;
    this.background = null;
    this.imageReveals = [];
    this.animationManager = null;
    this.sections = [];
    
    // Graphics effects
    this.physics3D = null;
    this.geometryField = null;
    this.floatingShapes = null;
    this.cursorTrail = null;
    this.mouseParallax = null;
    this.glowEffect = null;
    this.dynamicText = null;
    this.morphingBackground = null;
    this.cardPhysics = [];

    this.init();
  }

  async init() {
    // Initialize loader
    const loaderElement = document.getElementById('loader');
    if (loaderElement) {
      this.loader = new Loader(loaderElement);
    }

    // Initialize background
    this.background = new SmoothColorBackground('bg-canvas');

    // Initialize graphics effects
    this.geometryField = new GeometryField('particles-canvas');
    // Initialize 3D physics simulation
    this.physics3D = new Physics3D('helix-canvas');
    this.floatingShapes = new FloatingShapes('floating-shapes');
    this.cursorTrail = new CursorTrail();
    this.mouseParallax = new MouseParallax();
    this.glowEffect = new GlowEffect();
    this.dynamicText = new DynamicText();
    this.morphingBackground = new MorphingBackground();

    // Initialize interactive systems
    this.scrollInteraction = null;
    this.interactiveText = new InteractiveText();

    // Initialize animation manager
    this.animationManager = new AnimationManager();

    // Load data and initialize components
    await this.loadData();
    this.initComponents();

    // Initialize scroll interaction after components are ready
    this.scrollInteraction = new ScrollInteraction(
      this.geometryField,
      this.physics3D,
      this.floatingShapes
    );

    // Setup event listeners
    this.setupEvents();
    
    // Force cards to animate in if they're already visible
    setTimeout(() => {
      const projectItems = document.querySelectorAll('.project-item');
      projectItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible && !item.classList.contains('animate-in')) {
          item.classList.add('animate-in');
        }
      });
    }, 800);

    // Start loader animation
    if (this.loader) {
      await this.loader.animate(3000);
      this.onLoadComplete();
    } else {
      this.onLoadComplete();
    }

    // Start render loop
    this.render();
  }

  async loadData() {
    try {
      // Load about/hero/contact data
      const aboutPath = '/data/about.json';
      const aboutResponse = await fetch(aboutPath);
      if (aboutResponse.ok) {
        this.aboutData = await aboutResponse.json();
      } else {
        console.warn('About file not found, using defaults');
        this.aboutData = null;
      }

      // Load publications
      const publicationsPath = '/data/publications.json';
      const publicationsResponse = await fetch(publicationsPath);
      if (publicationsResponse.ok) {
        this.publications = await publicationsResponse.json();
      } else {
        console.warn('Publications file not found, using empty array');
        this.publications = [];
      }

      // Load awards
      const awardsPath = '/data/awards.json';
      const awardsResponse = await fetch(awardsPath);
      if (awardsResponse.ok) {
        this.awards = await awardsResponse.json();
      } else {
        console.warn('Awards file not found, using empty array');
        this.awards = [];
      }

      // Load projects - use absolute path for better compatibility with deployments
      const projectsPath = '/data/projects.json';
      const projectsResponse = await fetch(projectsPath);
      if (projectsResponse.ok) {
        this.projects = await projectsResponse.json();
      } else {
        console.warn('Projects file not found, using empty array');
        this.projects = [];
      }

      // Load experience - use absolute path for better compatibility with deployments
      const experiencePath = '/data/experience.json';
      const experienceResponse = await fetch(experiencePath);
      if (experienceResponse.ok) {
        this.experience = await experienceResponse.json();
      } else {
        console.warn('Experience file not found, using empty array');
        this.experience = [];
      }
    } catch (error) {
      console.warn('Could not load data files:', error);
      this.aboutData = null;
      this.publications = [];
      this.awards = [];
      this.projects = [];
      this.experience = [];
    }
  }

  initComponents() {
    // Render dynamic content from about.json
    this.renderHero();
    this.renderAbout();
    this.renderSkills();
    this.renderContact();
    this.renderResume();

    // Render publications and awards
    this.renderPublications();
    this.renderAwards();

    // Render projects
    this.renderProjects();

    // Render experience
    this.renderExperience();

    // Initialize card physics for projects
    this.initCardPhysics();

    // Initialize section observers
    this.initSectionObservers();
  }

  renderHero() {
    if (!this.aboutData || !this.aboutData.hero) return;

    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');

    if (heroTitle) {
      const lines = heroTitle.querySelectorAll('.hero-line');
      if (lines[0]) lines[0].textContent = this.aboutData.hero.name.firstName;
      if (lines[1]) lines[1].textContent = this.aboutData.hero.name.lastName;
    }

    if (heroSubtitle) {
      heroSubtitle.textContent = this.aboutData.hero.title;
    }
  }

  renderAbout() {
    if (!this.aboutData || !this.aboutData.about) return;

    const aboutText = document.querySelector('.about-text');
    if (!aboutText) return;

    // Clear existing content
    aboutText.innerHTML = '';

    // Add paragraphs from JSON
    this.aboutData.about.paragraphs.forEach(paragraph => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      aboutText.appendChild(p);
    });
  }

  renderContact() {
    if (!this.aboutData || !this.aboutData.contact) return;

    const contactDescription = document.querySelector('.contact-description');
    const contactLinks = document.querySelector('.contact-links');

    if (contactDescription) {
      contactDescription.textContent = this.aboutData.contact.description;
    }

    if (contactLinks) {
      contactLinks.innerHTML = '';

      this.aboutData.contact.links.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.className = 'contact-link';
        linkElement.id = link.type === 'email' ? 'emailLink' : '';
        
        if (link.type === 'link') {
          linkElement.target = '_blank';
          linkElement.rel = 'noopener noreferrer';
        }

        const label = document.createElement('span');
        label.className = 'contact-link-label';
        label.textContent = link.label;

        const value = document.createElement('span');
        value.className = 'contact-link-value';
        value.textContent = link.value;

        linkElement.appendChild(label);
        linkElement.appendChild(value);
        contactLinks.appendChild(linkElement);
      });
    }
  }

  renderResume() {
    if (!this.aboutData || !this.aboutData.resume) return;

    const resumeDescription = document.querySelector('.resume-description');
    const resumeButton = document.querySelector('.resume-button');

    if (resumeDescription) {
      resumeDescription.textContent = this.aboutData.resume.description;
    }

    if (resumeButton) {
      resumeButton.href = this.aboutData.resume.file;
      const buttonText = resumeButton.querySelector('.resume-button-text');
      if (buttonText) {
        buttonText.textContent = this.aboutData.resume.buttonText;
      }
    }
  }

  renderPublications() {
    const container = document.getElementById('publicationsContainer');
    if (!container || !this.publications || this.publications.length === 0) return;

    container.innerHTML = '';

    this.publications.forEach((pub, index) => {
      const pubItem = document.createElement('div');
      pubItem.className = 'publication-item';

      // Publication header
      const header = document.createElement('div');
      header.className = 'publication-header';

      const title = document.createElement('h3');
      title.className = 'publication-title';
      title.textContent = pub.title;

      const meta = document.createElement('div');
      meta.className = 'publication-meta';

      if (pub.type) {
        const type = document.createElement('span');
        type.className = `publication-type ui-badge ${pub.status === 'Published' ? 'ui-badge-primary' : 'ui-badge-secondary'}`;
        type.textContent = pub.type;
        meta.appendChild(type);
      }

      if (pub.year) {
        const year = document.createElement('span');
        year.className = 'publication-year';
        year.textContent = pub.year;
        meta.appendChild(year);
      }

      if (pub.status) {
        const status = document.createElement('span');
        status.className = `publication-status ui-badge ${pub.status === 'Published' ? 'ui-badge-glass' : 'ui-badge-secondary'}`;
        status.textContent = pub.status;
        meta.appendChild(status);
      }

      header.appendChild(title);
      header.appendChild(meta);

      // Authors
      const authors = document.createElement('p');
      authors.className = 'publication-authors';
      authors.textContent = pub.authors.join(', ');

      // Venue
      const venue = document.createElement('p');
      venue.className = 'publication-venue';
      venue.textContent = pub.venue;

      // Abstract
      const abstract = document.createElement('p');
      abstract.className = 'publication-abstract';
      abstract.textContent = pub.abstract || '';

      // Links
      const links = document.createElement('div');
      links.className = 'publication-links';

      if (pub.pdf) {
        const pdfLink = document.createElement('a');
        pdfLink.href = pub.pdf;
        pdfLink.target = '_blank';
        pdfLink.rel = 'noopener noreferrer';
        pdfLink.className = 'publication-link ui-button ui-button-outline';
        pdfLink.innerHTML = '<span>PDF</span><span>↗</span>';
        links.appendChild(pdfLink);
      }

      if (pub.arxiv) {
        const arxivLink = document.createElement('a');
        arxivLink.href = pub.arxiv;
        arxivLink.target = '_blank';
        arxivLink.rel = 'noopener noreferrer';
        arxivLink.className = 'publication-link ui-button ui-button-outline';
        arxivLink.innerHTML = '<span>arXiv</span><span>↗</span>';
        links.appendChild(arxivLink);
      }

      if (pub.code) {
        const codeLink = document.createElement('a');
        codeLink.href = pub.code;
        codeLink.target = '_blank';
        codeLink.rel = 'noopener noreferrer';
        codeLink.className = 'publication-link ui-button ui-button-secondary';
        codeLink.innerHTML = '<span>Code</span><span>↗</span>';
        links.appendChild(codeLink);
      }

      // Tags
      const tags = document.createElement('div');
      tags.className = 'publication-tags';
      if (pub.tags && pub.tags.length > 0) {
        const badgeClasses = ['ui-badge-primary', 'ui-badge-secondary', 'ui-badge-purple', 'ui-badge-blue'];
        pub.tags.forEach((tag, tagIndex) => {
          const tagElement = document.createElement('span');
          tagElement.className = `publication-tag ui-badge ${badgeClasses[tagIndex % badgeClasses.length]}`;
          tagElement.textContent = tag;
          tags.appendChild(tagElement);
        });
      }

      pubItem.appendChild(header);
      pubItem.appendChild(authors);
      pubItem.appendChild(venue);
      pubItem.appendChild(abstract);
      if (links.children.length > 0) {
        pubItem.appendChild(links);
      }
      if (tags.children.length > 0) {
        pubItem.appendChild(tags);
      }

      container.appendChild(pubItem);
    });
  }

  renderAwards() {
    const container = document.getElementById('awardsContainer');
    if (!container || !this.awards || this.awards.length === 0) return;

    container.innerHTML = '';

    this.awards.forEach((award, index) => {
      const awardItem = document.createElement('div');
      awardItem.className = 'award-item';

      // Award header
      const header = document.createElement('div');
      header.className = 'award-header';

      const title = document.createElement('h3');
      title.className = 'award-title';
      title.textContent = award.title;

      const meta = document.createElement('div');
      meta.className = 'award-meta';

      if (award.category) {
        const category = document.createElement('span');
        category.className = 'award-category ui-badge ui-badge-purple';
        category.textContent = award.category;
        meta.appendChild(category);
      }

      if (award.date) {
        const date = document.createElement('span');
        date.className = 'award-date';
        date.textContent = award.date;
        meta.appendChild(date);
      }

      header.appendChild(title);
      header.appendChild(meta);

      // Organization
      const organization = document.createElement('p');
      organization.className = 'award-organization';
      organization.textContent = award.organization;

      // Description
      const description = document.createElement('p');
      description.className = 'award-description';
      description.textContent = award.description || '';

      awardItem.appendChild(header);
      awardItem.appendChild(organization);
      awardItem.appendChild(description);

      container.appendChild(awardItem);
    });
  }

  renderProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container || !this.projects || this.projects.length === 0) return;

    container.innerHTML = '';

    this.projects.forEach((project, index) => {
      const projectItem = document.createElement('div');
      projectItem.className = 'project-item';

      const projectWrapper = document.createElement('div');
      projectWrapper.className = 'project-wrapper';

      // Check if project has images
      const images = project.images || (project.image ? [project.image] : []);
      
      // Only add image section if images exist
      if (images.length > 0) {
        const projectInner = document.createElement('div');
        projectInner.className = 'project-inner';

        if (images.length > 1) {
          // Create carousel for multiple images
          const carousel = document.createElement('div');
          carousel.className = 'project-carousel';
          
          const track = document.createElement('div');
          track.className = 'project-carousel-track';
          
          images.forEach((imageSrc, imgIndex) => {
            const slide = document.createElement('div');
            slide.className = 'project-carousel-slide';
            
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `${project.title || 'Project'} - Image ${imgIndex + 1}`;
            img.loading = 'lazy';
            
            slide.appendChild(img);
            track.appendChild(slide);
          });
          
          carousel.appendChild(track);
          
          // Add navigation dots
          const nav = document.createElement('div');
          nav.className = 'project-carousel-nav';
          
          images.forEach((_, dotIndex) => {
            const dot = document.createElement('div');
            dot.className = `project-carousel-dot ${dotIndex === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
              this.setCarouselSlide(carousel, dotIndex);
            });
            nav.appendChild(dot);
          });
          
          carousel.appendChild(nav);
          
          // Add prev/next buttons
          const prevBtn = document.createElement('button');
          prevBtn.className = 'project-carousel-button prev';
          prevBtn.innerHTML = '‹';
          prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.moveCarousel(carousel, -1);
          });
          
          const nextBtn = document.createElement('button');
          nextBtn.className = 'project-carousel-button next';
          nextBtn.innerHTML = '›';
          nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.moveCarousel(carousel, 1);
          });
          
          carousel.appendChild(prevBtn);
          carousel.appendChild(nextBtn);
          
          // Store carousel state
          carousel.dataset.currentSlide = '0';
          carousel.dataset.totalSlides = images.length.toString();
          
          projectInner.appendChild(carousel);
        } else {
          // Single image
          const img = document.createElement('img');
          img.src = images[0];
          img.alt = project.title || 'Project';
          img.loading = 'lazy';
          
          projectInner.appendChild(img);
        }
        
        projectWrapper.appendChild(projectInner);
      }
      
      const projectInfo = document.createElement('div');
      projectInfo.className = 'project-info';
      
      projectWrapper.appendChild(projectInfo);

      // Title and metadata row
      const titleRow = document.createElement('div');
      titleRow.className = 'project-title-row';

      const title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = project.title || 'Untitled Project';

      const projectMeta = document.createElement('div');
      projectMeta.className = 'project-meta';

      if (project.category) {
        const category = document.createElement('span');
        category.className = 'project-category ui-badge ui-badge-glass';
        category.textContent = project.category;
        projectMeta.appendChild(category);
      }

      if (project.year) {
        const year = document.createElement('span');
        year.className = 'project-year';
        year.textContent = project.year;
        projectMeta.appendChild(year);
      }

      if (project.status) {
        const status = document.createElement('span');
        status.className = `project-status ui-badge ${project.status === 'Active' ? 'ui-badge-primary' : 'ui-badge-secondary'}`;
        status.textContent = project.status;
        projectMeta.appendChild(status);
      }

      titleRow.appendChild(title);
      if (projectMeta.children.length > 0) {
        titleRow.appendChild(projectMeta);
      }

      projectInfo.appendChild(titleRow);

      // Description
      const description = document.createElement('p');
      description.className = 'project-description';
      description.textContent = project.description || '';

      // Long description (expandable)
      if (project.longDescription) {
        const longDescWrapper = document.createElement('div');
        longDescWrapper.className = 'project-long-desc-wrapper';
        
        const longDesc = document.createElement('p');
        longDesc.className = 'project-long-description';
        longDesc.textContent = project.longDescription;
        longDesc.style.display = 'none';

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'project-details-toggle';
        toggleBtn.textContent = 'Read More';
        toggleBtn.addEventListener('click', () => {
          const isExpanded = longDesc.style.display !== 'none';
          longDesc.style.display = isExpanded ? 'none' : 'block';
          toggleBtn.textContent = isExpanded ? 'Read More' : 'Read Less';
          projectInfo.classList.toggle('expanded');
        });

        longDescWrapper.appendChild(toggleBtn);
        longDescWrapper.appendChild(longDesc);
        projectInfo.appendChild(longDescWrapper);
      }

      projectInfo.appendChild(description);

      // Links row
      if (project.github || project.demo) {
        const linksRow = document.createElement('div');
        linksRow.className = 'project-links';

        if (project.github) {
          const githubLink = document.createElement('a');
          githubLink.href = project.github;
          githubLink.target = '_blank';
          githubLink.rel = 'noopener noreferrer';
          githubLink.className = 'project-link ui-button ui-button-outline';
          githubLink.innerHTML = '<span>GitHub</span><span>↗</span>';
          linksRow.appendChild(githubLink);
        }

        if (project.demo) {
          const demoLink = document.createElement('a');
          demoLink.href = project.demo;
          demoLink.target = '_blank';
          demoLink.rel = 'noopener noreferrer';
          demoLink.className = 'project-link ui-button ui-button-secondary';
          demoLink.innerHTML = '<span>Live Demo</span><span>↗</span>';
          linksRow.appendChild(demoLink);
        }

        projectInfo.appendChild(linksRow);
      }

      // Tags
      if (project.tags && project.tags.length > 0) {
        const tags = document.createElement('div');
        tags.className = 'project-tags';
        const badgeClasses = ['ui-badge-primary', 'ui-badge-secondary', 'ui-badge-purple', 'ui-badge-blue'];
        project.tags.forEach((tag, tagIndex) => {
          const tagElement = document.createElement('span');
          tagElement.className = `project-tag ui-badge ${badgeClasses[tagIndex % badgeClasses.length]}`;
          tagElement.textContent = tag;
          tags.appendChild(tagElement);
        });
        projectInfo.appendChild(tags);
      }

      projectItem.appendChild(projectWrapper);
      projectItem.classList.add('animate-on-scroll');
      container.appendChild(projectItem);
    });
  }

  renderExperience() {
    const container = document.getElementById('experienceContainer');
    if (!container || !this.experience || this.experience.length === 0) return;

    container.innerHTML = '';

    this.experience.forEach((exp, index) => {
      const expItem = document.createElement('div');
      expItem.className = 'experience-item';

      const header = document.createElement('div');
      header.className = 'experience-header';

      const title = document.createElement('h3');
      title.className = 'experience-title';
      title.textContent = exp.title || 'Untitled';

      const company = document.createElement('p');
      company.className = 'experience-company';
      company.textContent = exp.company || '';

      const date = document.createElement('p');
      date.className = 'experience-date';
      date.textContent = exp.date || '';

      header.appendChild(title);
      header.appendChild(company);
      header.appendChild(date);

      const description = document.createElement('p');
      description.className = 'experience-description';
      description.textContent = exp.description || '';

      expItem.appendChild(header);
      expItem.appendChild(description);

      // Projects under experience
      if (exp.projects && exp.projects.length > 0) {
        const projectsSection = document.createElement('div');
        projectsSection.className = 'experience-projects';

        const projectsTitle = document.createElement('h4');
        projectsTitle.className = 'experience-projects-title';
        projectsTitle.textContent = 'Key Projects';
        projectsSection.appendChild(projectsTitle);

        const projectsList = document.createElement('div');
        projectsList.className = 'experience-projects-list';

        exp.projects.forEach((project) => {
          const projectCard = document.createElement('div');
          projectCard.className = 'experience-project-card ui-card';

          const projectHeader = document.createElement('div');
          projectHeader.className = 'experience-project-header';

          const projectTitle = document.createElement('h5');
          projectTitle.className = 'experience-project-title';
          projectTitle.textContent = project.title || 'Untitled Project';

          const projectYear = document.createElement('span');
          projectYear.className = 'experience-project-year';
          projectYear.textContent = project.year || '';

          projectHeader.appendChild(projectTitle);
          if (project.year) {
            projectHeader.appendChild(projectYear);
          }

          const projectDesc = document.createElement('p');
          projectDesc.className = 'experience-project-description';
          projectDesc.textContent = project.description || '';

          const projectLinks = document.createElement('div');
          projectLinks.className = 'experience-project-links';

          if (project.github) {
            const githubLink = document.createElement('a');
            githubLink.href = project.github;
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
            githubLink.className = 'experience-project-link ui-button ui-button-outline';
            githubLink.innerHTML = '<span>GitHub</span><span>↗</span>';
            projectLinks.appendChild(githubLink);
          }

          if (project.demo) {
            const demoLink = document.createElement('a');
            demoLink.href = project.demo;
            demoLink.target = '_blank';
            demoLink.rel = 'noopener noreferrer';
            demoLink.className = 'experience-project-link ui-button ui-button-secondary';
            demoLink.innerHTML = '<span>Demo</span><span>↗</span>';
            projectLinks.appendChild(demoLink);
          }

          projectCard.appendChild(projectHeader);
          projectCard.appendChild(projectDesc);
          if (projectLinks.children.length > 0) {
            projectCard.appendChild(projectLinks);
          }

          projectsList.appendChild(projectCard);
        });

        projectsSection.appendChild(projectsList);
        expItem.appendChild(projectsSection);
      }

      if (exp.technologies && exp.technologies.length > 0) {
        const tech = document.createElement('div');
        tech.className = 'experience-tech';
        const badgeClasses = ['ui-badge-primary', 'ui-badge-secondary', 'ui-badge-purple', 'ui-badge-blue', 'ui-badge-glass'];
        exp.technologies.forEach((techItem, techIndex) => {
          const techTag = document.createElement('span');
          techTag.className = `experience-tech-tag ui-badge ${badgeClasses[techIndex % badgeClasses.length]}`;
          techTag.textContent = techItem;
          tech.appendChild(techTag);
        });
        expItem.appendChild(tech);
      }

      container.appendChild(expItem);
    });
  }

  renderSkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) return;

    // Use skills from JSON if available, otherwise use defaults
    const skills = (this.aboutData && this.aboutData.skills) ? this.aboutData.skills : {
      'Graphics & Rendering': ['C++', 'OpenGL', 'GLSL', 'WebGL', 'Three.js', 'Real-time Rendering', 'GPU Programming'],
      'Machine Learning': ['PyTorch', 'Neural Rendering', 'NeRF', 'Deep Learning', 'Reinforcement Learning', 'Computer Vision'],
      'VR/AR Development': ['Unity', 'C#', 'HoloLens', 'Oculus', 'VR/AR Systems', 'Mixed Reality'],
      'Languages & Tools': ['Python', 'JavaScript', 'C++', 'Git', 'Blender', 'Docker', 'Jupyter Notebook']
    };

    skillsGrid.innerHTML = '';
    
    Object.entries(skills).forEach(([category, items], index) => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'skill-category';

      const title = document.createElement('h4');
      title.className = 'skill-category-title';
      title.textContent = category;

      const list = document.createElement('ul');
      list.className = 'skill-list';

      items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'skill-item';
        listItem.textContent = item;
        list.appendChild(listItem);
      });

      categoryDiv.appendChild(title);
      categoryDiv.appendChild(list);
      skillsGrid.appendChild(categoryDiv);
    });
  }

  // Carousel helper methods
  setCarouselSlide(carousel, slideIndex) {
    const track = carousel.querySelector('.project-carousel-track');
    const dots = carousel.querySelectorAll('.project-carousel-dot');
    const totalSlides = parseInt(carousel.dataset.totalSlides);
    
    // Ensure slide index is within bounds
    slideIndex = (slideIndex + totalSlides) % totalSlides;
    
    // Update transform
    track.style.transform = `translateX(-${slideIndex * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === slideIndex);
    });
    
    // Update carousel state
    carousel.dataset.currentSlide = slideIndex.toString();
  }

  moveCarousel(carousel, direction) {
    const currentSlide = parseInt(carousel.dataset.currentSlide);
    this.setCarouselSlide(carousel, currentSlide + direction);
  }

  initImageReveals() {
    // Image reveals removed - using card physics instead
  }

  initCardPhysics() {
    const projectItems = document.querySelectorAll('.project-item');
    this.cardPhysics = [];
    
    // Animate in cards with observer - trigger much earlier with stagger
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, entryIndex) => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const itemIndex = Array.from(projectItems).indexOf(item);
          
          // Staggered animation with delay
          setTimeout(() => {
            item.classList.add('animate-in');
          }, itemIndex * 150);
          
          // Initialize physics after animation starts
          setTimeout(() => {
            try {
              const physics = new CardPhysics(item);
              if (physics) {
                this.cardPhysics.push(physics);
              }
            } catch (error) {
              console.warn('Failed to initialize card physics:', error);
            }
          }, itemIndex * 150 + 300);
          
          observer.unobserve(item);
        }
      });
    }, { 
      threshold: 0.02, // Trigger when just 2% visible
      rootMargin: '200px' // Start animation 200px before it comes into view
    });

    projectItems.forEach(item => {
      observer.observe(item);
    });
  }

  initSectionObservers() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const observer = new Observer({
        element: section,
        config: { 
          threshold: 0.05, // Lower threshold for earlier animation trigger
          rootMargin: '100px 0px -10% 0px' // Trigger earlier
        }
      });

      observer.onEnter = () => {
        // Animate in section titles
        const title = section.querySelector('.section-title');
        const description = section.querySelector('.section-description');
        const resumeDesc = section.querySelector('.resume-description');
        const resumeBtn = section.querySelector('.resume-button');
        const aboutText = section.querySelector('.about-text');
        const skillsGrid = section.querySelector('.skills-grid');
        const skillCategories = section.querySelectorAll('.skill-category');
        const contactDesc = section.querySelector('.contact-description');
        const contactLinks = section.querySelectorAll('.contact-link');
        const experienceItems = section.querySelectorAll('.experience-item');
        const publicationItems = section.querySelectorAll('.publication-item');
        const awardItems = section.querySelectorAll('.award-item');

        if (title) title.classList.add('animate-in');
        if (description) description.classList.add('animate-in');
        if (resumeDesc) resumeDesc.classList.add('animate-in');
        if (resumeBtn) resumeBtn.classList.add('animate-in');
        if (aboutText) aboutText.classList.add('animate-in');
        if (skillsGrid) skillsGrid.classList.add('animate-in');
        if (contactDesc) contactDesc.classList.add('animate-in');
        
        // Staggered animations for skill cards
        skillCategories.forEach((skill, index) => {
          setTimeout(() => skill.classList.add('animate-in'), index * 150);
        });
        
        contactLinks.forEach((link, index) => {
          setTimeout(() => link.classList.add('animate-in'), index * 100);
        });

        experienceItems.forEach((item, index) => {
          setTimeout(() => item.classList.add('animate-in'), index * 150);
        });

        publicationItems.forEach((item, index) => {
          setTimeout(() => item.classList.add('animate-in'), index * 150);
        });

        awardItems.forEach((item, index) => {
          setTimeout(() => item.classList.add('animate-in'), index * 150);
        });
      };

      this.sections.push(observer);
    });
  }

  setupEvents() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const target = document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Handle resume button
    const resumeButton = document.getElementById('resumeButton');
    if (resumeButton) {
      resumeButton.addEventListener('click', (e) => {
        // Check if file exists, if not show alert
        const resumePath = resumeButton.getAttribute('href');
        fetch(resumePath)
          .then(response => {
            if (!response.ok) {
              e.preventDefault();
              alert('Resume file not found. Please check the resume filename in index.html matches your file.');
            }
          })
          .catch(() => {
            // File doesn't exist, but let browser handle it
          });
      });
    }

    // Resize handler
    window.addEventListener('resize', utils.debounce(() => {
      if (this.cardPhysics) {
        this.cardPhysics.forEach(physics => {
          if (physics && physics.resize) {
            physics.resize();
          }
        });
      }
      if (this.background) {
        this.background.resize();
      }
    }, 250));
  }

  onLoadComplete() {
    // Animate in hero text with scramble effect
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
      const lines = heroTitle.querySelectorAll('.hero-line');
      lines.forEach((line, index) => {
        setTimeout(async () => {
          await scrambleText(line, {
            chars: 'SATRAJITGHOSH',
            duration: 1200,
            delay: index * 200
          });
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        }, index * 300);
      });
    }

    // Animate in hero subtitle
    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle) {
      setTimeout(() => {
        heroSubtitle.classList.add('animate-in');
      }, 800);
    }
  }

  render() {
    requestAnimationFrame(() => this.render());

    // Update background
    if (this.background) {
      this.background.render();
    }

    // Update graphics effects (scroll interaction updates on scroll event)
    if (this.geometryField) {
      this.geometryField.render();
    }
    if (this.physics3D) {
      this.physics3D.render();
    }
    if (this.floatingShapes) {
      this.floatingShapes.render();
    }
    if (this.cursorTrail) {
      this.cursorTrail.render();
    }

    // Animation manager handles all animations
    if (this.animationManager) {
      this.animationManager.render();
    }
  }
}

// ============================================
// ANIMATION MANAGER
// Single render loop for all animations
// ============================================

class AnimationManager {
  constructor() {
    this.animations = new Set();
    this.isRunning = false;
  }

  add(callback) {
    this.animations.add(callback);
    if (!this.isRunning) this.start();
  }

  remove(callback) {
    this.animations.delete(callback);
    if (this.animations.size === 0) this.stop();
  }

  start() {
    this.isRunning = true;
    this.render();
  }

  stop() {
    this.isRunning = false;
  }

  render() {
    if (!this.isRunning) return;

    requestAnimationFrame(() => this.render());

    this.animations.forEach(callback => {
      callback();
    });
  }
}

// ============================================
// INITIALIZE APP
// ============================================

let app;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new App();
  });
} else {
  app = new App();
}

