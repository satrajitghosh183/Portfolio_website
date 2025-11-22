// ============================================
// ADVANCED PARTICLE SYSTEM
// Complex particle network with physics and interactions
// ============================================

class ParticleSystem {
  constructor(canvasId = 'particles-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 120;
    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 0, vy: 0 };
    this.time = 0;
    this.maxDistance = 220;
    this.mouseRadius = 150;
    this.gravity = 0.0001;

    this.resize();
    this.initParticles();
    this.setupEventListeners();

    window.addEventListener('resize', utils.debounce(() => this.resize(), 250));
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initParticles();
  }

  initParticles() {
    if (!this.canvas) return;
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const angle = (Math.PI * 2 * i) / this.particleCount;
      const radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
      this.particles.push({
        x: this.canvas.width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 200,
        y: this.canvas.height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1,
        baseSize: Math.random() * 3 + 1,
        opacity: Math.random() * 0.7 + 0.5,
        baseOpacity: Math.random() * 0.7 + 0.5,
        hue: Math.random() * 60 + 180, // Blue to cyan range
        trail: [],
      });
    }
  }

  setupEventListeners() {
    let lastX = this.mouse.x;
    let lastY = this.mouse.y;
    
    document.addEventListener('mousemove', (e) => {
      this.mouse.vx = e.clientX - lastX;
      this.mouse.vy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      this.mouse.vx = 0;
      this.mouse.vy = 0;
    });
  }

  update() {
    if (!this.canvas || !this.ctx) return;

    this.time += 0.016;

    // Clear with minimal fade to keep graphics vibrant
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.02)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update particles
    this.particles.forEach((particle, i) => {
      // Save trail position
      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > 8) particle.trail.shift();

      // Perlin-like noise for organic movement
      const noiseX = Math.sin(this.time * 0.5 + i * 0.1) * 0.1;
      const noiseY = Math.cos(this.time * 0.5 + i * 0.1) * 0.1;
      
      particle.vx += noiseX * 0.01;
      particle.vy += noiseY * 0.01;

      // Mouse interaction with repulsion
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.mouseRadius && distance > 0) {
        const force = (this.mouseRadius - distance) / this.mouseRadius;
        const angle = Math.atan2(dy, dx);
        particle.vx -= Math.cos(angle) * force * 0.02;
        particle.vy -= Math.sin(angle) * force * 0.02;
      }

      // Boundary repulsion
      const margin = 50;
      if (particle.x < margin) particle.vx += (margin - particle.x) * 0.001;
      if (particle.x > this.canvas.width - margin) particle.vx -= (particle.x - (this.canvas.width - margin)) * 0.001;
      if (particle.y < margin) particle.vy += (margin - particle.y) * 0.001;
      if (particle.y > this.canvas.height - margin) particle.vy -= (particle.y - (this.canvas.height - margin)) * 0.001;

      // Velocity damping
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      // Apply scroll-based offset if available
      if (particle.scrollOffsetY !== undefined) {
        particle.y += particle.scrollOffsetY * 0.5;
        particle.scrollOffsetY *= 0.9; // Decay
      }
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges smoothly
      if (particle.x < -50) particle.x = this.canvas.width + 50;
      if (particle.x > this.canvas.width + 50) particle.x = -50;
      if (particle.y < -50) particle.y = this.canvas.height + 50;
      if (particle.y > this.canvas.height + 50) particle.y = -50;

      // Animate size and opacity
      particle.size = particle.baseSize + Math.sin(this.time + i) * 0.3;
      particle.opacity = particle.baseOpacity + Math.sin(this.time * 2 + i) * 0.1;
    });

    // Draw connections with gradient
    this.particles.forEach((particle, i) => {
      this.particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.maxDistance) {
          const opacity = (1 - distance / this.maxDistance) * 0.15;
          const gradient = this.ctx.createLinearGradient(
            particle.x, particle.y,
            otherParticle.x, otherParticle.y
          );
          
          gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 75%, ${opacity})`);
          gradient.addColorStop(1, `hsla(${otherParticle.hue}, 80%, 75%, ${opacity})`);

          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });

    // Draw particles with trails
    this.particles.forEach((particle) => {
      // Draw trail - more visible
      if (particle.trail.length > 1) {
        this.ctx.beginPath();
        particle.trail.forEach((point, index) => {
          if (index === 0) {
            this.ctx.moveTo(point.x, point.y);
          } else {
            this.ctx.lineTo(point.x, point.y);
          }
        });
        this.ctx.strokeStyle = `hsla(${particle.hue}, 80%, 75%, ${particle.opacity * 0.12})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }

      // Draw particle with much reduced glow
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 5
      );
      gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 75%, ${particle.opacity * 0.25})`);
      gradient.addColorStop(0.3, `hsla(${particle.hue}, 80%, 75%, ${particle.opacity * 0.2})`);
      gradient.addColorStop(0.6, `hsla(${particle.hue}, 80%, 75%, ${particle.opacity * 0.1})`);
      gradient.addColorStop(1, `hsla(${particle.hue}, 80%, 75%, 0)`);

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      // Core particle - much dimmed
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${particle.hue}, 85%, 80%, ${Math.min(particle.opacity * 0.4, 0.5)})`;
      this.ctx.fill();
    });
  }

  render() {
    this.update();
  }

  destroy() {
    // Cleanup
  }
}

