// ============================================
// CARD PHYSICS ANIMATION
// Physics-based animations for project cards
// ============================================

class CardPhysics {
  constructor(element) {
    this.element = element;
    this.wrapper = element.querySelector('.project-wrapper');
    if (!this.wrapper) return;

    this.bounds = this.wrapper.getBoundingClientRect();
    this.rotation = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };
    this.basePosition = { x: 0, y: 0 };
    
    this.mouse = { x: 0, y: 0 };
    this.isHovered = false;
    this.time = 0;
    this.floatOffset = 0;

    // Physics constants
    this.friction = 0.85;
    this.spring = 0.15;
    this.maxRotation = 15;
    this.floatSpeed = 0.003;
    this.floatAmount = 10;

    this.init();
    this.animate();
  }

  init() {
    // Setup mouse tracking
    this.wrapper.addEventListener('mouseenter', () => {
      this.isHovered = true;
    });

    this.wrapper.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.targetRotation = { x: 0, y: 0 };
    });

    this.wrapper.addEventListener('mousemove', (e) => {
      if (!this.isHovered) return;
      
      const rect = this.wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const normalizedX = deltaX / (rect.width / 2);
      const normalizedY = deltaY / (rect.height / 2);
      
      this.targetRotation.x = -normalizedY * this.maxRotation;
      this.targetRotation.y = normalizedX * this.maxRotation;
    });

    // Initial floating offset
    this.floatOffset = Math.random() * Math.PI * 2;
  }

  update() {
    if (!this.wrapper) return;

    this.time += this.floatSpeed;

    // Smooth rotation interpolation (spring physics)
    const deltaX = this.targetRotation.x - this.rotation.x;
    const deltaY = this.targetRotation.y - this.rotation.y;
    
    this.velocity.x += deltaX * this.spring;
    this.velocity.y += deltaY * this.spring;
    
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    
    this.rotation.x += this.velocity.x;
    this.rotation.y += this.velocity.y;

    // Floating animation
    const floatY = Math.sin(this.time + this.floatOffset) * this.floatAmount;
    this.position.y = this.basePosition.y + floatY;

    // Apply transforms
    const rotateX = this.rotation.x;
    const rotateY = this.rotation.y;
    const translateY = this.position.y;

    this.wrapper.style.transform = `
      translateY(${translateY}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
    this.wrapper.style.transformStyle = 'preserve-3d';
  }

  animate() {
    this.update();
    requestAnimationFrame(() => this.animate());
  }

  resize() {
    this.bounds = this.wrapper.getBoundingClientRect();
  }
}

