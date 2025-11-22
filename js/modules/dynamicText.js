// ============================================
// DYNAMIC TEXT EFFECTS
// Typing, morphing, and reveal animations
// ============================================

class DynamicText {
  constructor() {
    this.init();
  }
  
  init() {
    this.animateTitles();
    this.animateDescriptions();
    this.addTextHoverEffects();
  }
  
  animateTitles() {
    const titles = document.querySelectorAll('.section-title, .experience-title, .project-title');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          setTimeout(() => {
            this.typeWriter(entry.target);
            entry.target.dataset.animated = 'true';
          }, index * 100);
        }
      });
    }, { threshold: 0.3 });
    
    titles.forEach(title => observer.observe(title));
  }
  
  typeWriter(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    const speed = 30;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }
  
  animateDescriptions() {
    const descriptions = document.querySelectorAll('.project-description, .experience-description');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }
      });
    }, { threshold: 0.2 });
    
    descriptions.forEach(desc => observer.observe(desc));
  }
  
  addTextHoverEffects() {
    const interactiveText = document.querySelectorAll('h1, h2, h3, .project-title, .experience-title');
    
    interactiveText.forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.05)';
        el.style.textShadow = '0 0 30px rgba(75, 0, 255, 0.8)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.textShadow = '';
      });
    });
  }
}

