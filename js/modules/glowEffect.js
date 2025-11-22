// ============================================
// INTERACTIVE GLOW EFFECT
// Creates dynamic glow effects that follow the cursor
// ============================================

class GlowEffect {
  constructor() {
    this.glowElement = null;
    this.mouse = { x: 0, y: 0 };
    this.init();
  }
  
  init() {
    // Create glow element
    this.glowElement = document.createElement('div');
    this.glowElement.className = 'cursor-glow';
    document.body.appendChild(this.glowElement);
    
    // Mouse move handler
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.updateGlow();
    });
    
    // Add glow effect to interactive elements
    this.addInteractiveGlow();
  }
  
  updateGlow() {
    this.glowElement.style.left = `${this.mouse.x}px`;
    this.glowElement.style.top = `${this.mouse.y}px`;
  }
  
  addInteractiveGlow() {
    const interactiveElements = document.querySelectorAll(
      '.project-wrapper, .ui-button, .contact-link, .skill-category, .nav-link'
    );
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.glowElement.classList.add('active');
      });
      
      el.addEventListener('mouseleave', () => {
        this.glowElement.classList.remove('active');
      });
    });
  }
}

