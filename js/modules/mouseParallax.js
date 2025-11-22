// ============================================
// MOUSE PARALLAX EFFECT
// Smooth parallax movement based on mouse position
// ============================================

class MouseParallax {
  constructor() {
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.smoothMouse = { x: this.mouse.x, y: this.mouse.y };
    this.elements = [];
    this.isRunning = false;
    
    this.init();
  }
  
  init() {
    // Find all elements that should have parallax
    this.findElements();
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    // Start animation loop
    this.animate();
  }
  
  findElements() {
    // Add parallax to specific elements
    const titles = document.querySelectorAll('.hero-title, .section-title');
    const cards = document.querySelectorAll('.project-wrapper, .skill-category, .experience-item');
    
    titles.forEach(el => {
      this.elements.push({ el, depth: 0.02 });
    });
    
    cards.forEach(el => {
      this.elements.push({ el, depth: 0.03 });
    });
  }
  
  animate() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.update();
    }
  }
  
  update() {
    requestAnimationFrame(() => this.update());
    
    // Smooth mouse movement
    this.smoothMouse.x += (this.mouse.x - this.smoothMouse.x) * 0.05;
    this.smoothMouse.y += (this.mouse.y - this.smoothMouse.y) * 0.05;
    
    // Calculate offset from center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const offsetX = (this.smoothMouse.x - centerX) / centerX;
    const offsetY = (this.smoothMouse.y - centerY) / centerY;
    
    // Apply parallax to elements
    this.elements.forEach(({ el, depth }) => {
      if (el && this.isInViewport(el)) {
        const x = offsetX * 50 * depth;
        const y = offsetY * 50 * depth;
        el.style.transform = `translate(${x}px, ${y}px)`;
      }
    });
  }
  
  isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0
    );
  }
}

