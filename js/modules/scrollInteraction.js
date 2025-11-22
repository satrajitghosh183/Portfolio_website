// ============================================
// SCROLL INTERACTION SYSTEM
// Interactive physics and animations based on scroll position
// Inspired by Lando Norris website
// ============================================

class ScrollInteraction {
  constructor(particles, particleNetwork, floatingShapes) {
    this.particles = particles;
    this.particleNetwork = particleNetwork;
    this.floatingShapes = floatingShapes;
    
    this.scrollY = 0;
    this.scrollVelocity = 0;
    this.lastScrollY = 0;
    this.scrollProgress = 0;
    this.sectionProgress = {};
    
    this.sections = [];
    this.currentSection = null;
    
    this.smoothScrollY = 0;
    this.targetScrollY = 0;
    
    this.init();
  }

  init() {
    this.setupSections();
    this.setupEventListeners();
    this.updateScroll();
  }

  setupSections() {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const id = section.id;
      this.sections.push({
        id,
        element: section,
        bounds: null,
        progress: 0,
        color: section.dataset.color || '#0a0a0a'
      });
    });
  }

  setupEventListeners() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Smooth scroll tracking
    this.updateScroll();
  }

  updateScroll() {
    this.lastScrollY = this.scrollY;
    this.scrollY = window.scrollY || window.pageYOffset;
    this.scrollVelocity = this.scrollY - this.lastScrollY;
    
    // Smooth scroll for physics
    this.targetScrollY = this.scrollY;
    this.smoothScrollY += (this.targetScrollY - this.smoothScrollY) * 0.1;
    
    // Calculate total scroll height
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = totalHeight > 0 ? this.scrollY / totalHeight : 0;
    
    this.updateSections();
    this.updatePhysics();
    this.updateContent();
  }

  updateSections() {
    this.sections.forEach(section => {
      const rect = section.element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Calculate section progress (0 to 1)
      let progress = 0;
      
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        // Section is in view
        const visibleHeight = Math.min(
          windowHeight - Math.max(0, sectionTop),
          sectionHeight - Math.max(0, -sectionTop)
        );
        progress = visibleHeight / Math.max(windowHeight, sectionHeight);
        
        // More detailed progress based on scroll position
        const scrollOffset = -sectionTop;
        progress = Math.max(0, Math.min(1, scrollOffset / (windowHeight * 0.5)));
      }
      
      section.progress = progress;
      section.bounds = rect;
      
      // Update current section
      if (progress > 0.1 && (!this.currentSection || progress > this.currentSection.progress)) {
        this.currentSection = section;
      }
    });
  }

  updatePhysics() {
    if (!this.particles && !this.particleNetwork && !this.floatingShapes) return;
    
    // React to scroll velocity
    const scrollIntensity = Math.min(Math.abs(this.scrollVelocity) / 15, 1);
    
    // Apply scroll-based transformations to advanced particles
    if (this.particles && this.particles.particles && Array.isArray(this.particles.particles)) {
      this.particles.particles.forEach((particle, i) => {
        // Add subtle scroll-based movement
        if (particle.vy !== undefined) {
          particle.vy += this.scrollVelocity * 0.001;
        }
      });
    }
    
    // Particle network reacts to scroll
    if (this.particleNetwork && this.particleNetwork.particles && Array.isArray(this.particleNetwork.particles)) {
      // Add subtle velocity changes based on scroll
      const scrollForce = this.scrollVelocity * 0.001;
      this.particleNetwork.particles.forEach((particle, i) => {
        if (particle) {
          particle.vy += scrollForce * (Math.sin(i * 0.1) * 0.5);
        }
      });
    }
    
    // Floating shapes react to scroll
    if (this.floatingShapes && this.floatingShapes.shapes && Array.isArray(this.floatingShapes.shapes)) {
      this.floatingShapes.shapes.forEach((shape, i) => {
        const scrollWave = Math.sin((this.scrollY + i * 15) * 0.001) * scrollIntensity * 2;
        if (!shape.scrollRotation) shape.scrollRotation = 0;
        if (!shape.scrollScale) shape.scrollScale = 1;
        shape.scrollRotation = scrollWave * 3;
        shape.scrollScale = 1 + scrollIntensity * 0.05;
      });
    }
  }

  updateContent() {
    // Update section titles and content based on scroll
    this.sections.forEach(section => {
      const title = section.element.querySelector('.section-title');
      const description = section.element.querySelector('.section-description');
      const content = section.element.querySelectorAll('.animate-on-scroll');
      
      if (title && section.progress > 0) {
        const opacity = Math.min(section.progress * 2, 1);
        const translateY = (1 - section.progress * 2) * 30;
        
        title.style.opacity = opacity;
        title.style.transform = `translateY(${Math.max(0, translateY)}px)`;
      }
      
      if (description && section.progress > 0.2) {
        const opacity = Math.min((section.progress - 0.2) * 2, 1);
        const translateY = (1 - (section.progress - 0.2) * 2) * 20;
        
        description.style.opacity = opacity;
        description.style.transform = `translateY(${Math.max(0, translateY)}px)`;
      }
      
      // Animate content elements
      content.forEach((element, index) => {
        if (section.progress > 0.1 + index * 0.1) {
          const elementProgress = (section.progress - (0.1 + index * 0.1)) * 2;
          const opacity = Math.min(elementProgress, 1);
          const translateY = (1 - elementProgress) * 50;
          
          element.style.opacity = opacity;
          element.style.transform = `translateY(${Math.max(0, translateY)}px)`;
        }
      });
    });
  }

  getScrollProgress() {
    return this.scrollProgress;
  }

  getCurrentSection() {
    return this.currentSection;
  }

  getScrollVelocity() {
    return this.scrollVelocity;
  }
}

