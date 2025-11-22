// ============================================
// CURSOR TRAIL EFFECT
// Interactive cursor trail with particles
// ============================================

class CursorTrail {
  constructor() {
    this.trail = [];
    this.maxTrailLength = 20;
    this.mouse = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
    });

    // Create cursor element
    this.cursor = document.createElement('div');
    this.cursor.className = 'cursor-trail';
    document.body.appendChild(this.cursor);

    // Create particles container
    this.particlesContainer = document.createElement('div');
    this.particlesContainer.className = 'cursor-particles';
    document.body.appendChild(this.particlesContainer);

    // Hide default cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-item, .contact-link');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'none';
        this.cursor.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'default';
        this.cursor.classList.remove('active');
      });
    });
  }

  update() {
    // Smooth cursor movement
    this.mouse.x = utils.lerp(this.mouse.x, this.target.x, 0.15);
    this.mouse.y = utils.lerp(this.mouse.y, this.target.y, 0.15);

    // Update cursor position
    if (this.cursor) {
      this.cursor.style.left = `${this.mouse.x}px`;
      this.cursor.style.top = `${this.mouse.y}px`;
    }

    // Add to trail
    this.trail.push({ x: this.mouse.x, y: this.mouse.y });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Update trail elements
    this.updateTrail();
  }

  updateTrail() {
    // Remove old trail dots
    const oldDots = this.particlesContainer.querySelectorAll('.trail-dot');
    oldDots.forEach(dot => dot.remove());

    // Create new trail dots
    this.trail.forEach((point, index) => {
      const dot = document.createElement('div');
      dot.className = 'trail-dot';
      const progress = index / this.trail.length;
      const size = 4 * (1 - progress);
      const opacity = 0.3 * (1 - progress);
      
      dot.style.left = `${point.x}px`;
      dot.style.top = `${point.y}px`;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.opacity = opacity;
      
      this.particlesContainer.appendChild(dot);
    });
  }

  createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    this.particlesContainer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }

  render() {
    this.update();
  }

  destroy() {
    if (this.cursor) this.cursor.remove();
    if (this.particlesContainer) this.particlesContainer.remove();
  }
}

