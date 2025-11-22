// ============================================
// INTERACTIVE TEXT EFFECTS
// Text animations and effects inspired by Lando Norris website
// ============================================

class InteractiveText {
  constructor() {
    this.elements = [];
    this.init();
  }

  init() {
    this.setupTextElements();
    this.setupHoverEffects();
  }

  setupTextElements() {
    // Find all text elements that should be interactive
    const selectors = [
      '.hero-title',
      '.section-title'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element && element.textContent) {
          this.makeSplitText(element);
        }
      });
    });

    // Setup other interactive elements without split text
    const otherSelectors = ['.hero-subtitle', '.project-title', '.experience-title', '.nav-link'];
    otherSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element) {
          this.elements.push({
            element,
            originalText: element.textContent || '',
            animated: false
          });
        }
      });
    });
  }

  makeSplitText(element) {
    const text = element.textContent;
    const words = text.split(' ');
    element.innerHTML = '';
    
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.style.display = 'inline-block';
      wordSpan.style.overflow = 'hidden';
      
      const chars = word.split('');
      chars.forEach((char, charIndex) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        charSpan.textContent = char === ' ' ? '\u00A0' : char;
        charSpan.style.display = 'inline-block';
        charSpan.style.transform = 'translateY(100%)';
        charSpan.style.transition = `transform 0.5s cubic-bezier(0.5, 0, 0.5, 1) ${wordIndex * 0.05 + charIndex * 0.02}s`;
        wordSpan.appendChild(charSpan);
      });
      
      if (wordIndex < words.length - 1) {
        const space = document.createTextNode(' ');
        element.appendChild(space);
      }
      
      element.appendChild(wordSpan);
    });
    
    // Animate on load
    setTimeout(() => {
      const chars = element.querySelectorAll('.char');
      chars.forEach(char => {
        char.style.transform = 'translateY(0)';
      });
    }, 100);
  }

  setupHoverEffects() {
    // Add hover effects to links and titles
    const interactiveElements = document.querySelectorAll('a, .project-title, .experience-title');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.onHoverEnter(element, e);
      });
      
      element.addEventListener('mouseleave', () => {
        this.onHoverLeave(element);
      });
    });
  }

  onHoverEnter(element, event) {
    if (element.classList.contains('project-title') || element.classList.contains('experience-title')) {
      // Scale and glow effect
      element.style.transform = 'scale(1.05)';
      element.style.textShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
      element.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), text-shadow 0.3s ease';
    }
    
    // Create ripple effect
    if (event) {
      this.createRipple(element, event);
    }
  }

  onHoverLeave(element) {
    if (element.classList.contains('project-title') || element.classList.contains('experience-title')) {
      element.style.transform = 'scale(1)';
      element.style.textShadow = '';
    }
  }

  createRipple(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    ripple.style.opacity = '1';
    
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    requestAnimationFrame(() => {
      ripple.style.transform = 'translate(-50%, -50%) scale(20)';
      ripple.style.opacity = '0';
    });
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  revealOnScroll(element, progress) {
    if (element.dataset.revealed) return;
    
    if (progress > 0.1) {
      element.dataset.revealed = 'true';
      
      if (element.classList.contains('word')) {
        const chars = element.querySelectorAll('.char');
        chars.forEach((char, index) => {
          setTimeout(() => {
            char.style.transform = 'translateY(0)';
          }, index * 30);
        });
      }
    }
  }
}

