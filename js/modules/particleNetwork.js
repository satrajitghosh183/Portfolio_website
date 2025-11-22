// ============================================
// MODERN PARTICLE NETWORK
// Connected particles forming a network with blue connections
// ============================================

class ParticleNetwork {
  constructor(canvasId = 'helix-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Particle Network: Canvas with id "${canvasId}" not found.`);
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.isInitialized = false;
    this.animationFrame = null;

    // Configuration
    this.config = {
      particleCount: 100,
      particleSize: 2.5,
      particleColor: 'rgba(75, 0, 255, 0.9)', // Electric purple
      lineColor: 'rgba(75, 0, 255, 0.4)',
      maxDistance: 160,
      speed: 0.7,
      mouseInfluence: 120
    };

    this.init();
  }

  init() {
    if (!this.canvas) return;

    this.resize();
    this.createParticles();
    this.setupEvents();
    
    this.isInitialized = true;
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Recreate particles when resizing
    if (this.particles.length > 0) {
      this.createParticles();
    }
  }

  createParticles() {
    this.particles = [];
    const { particleCount } = this.config;
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.speed,
        vy: (Math.random() - 0.5) * this.config.speed,
        radius: Math.random() * 2 + 1
      });
    }
  }

  setupEvents() {
    // Mouse move
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Mouse leave
    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Resize
    window.addEventListener('resize', utils.debounce(() => {
      this.resize();
    }, 250));
  }

  updateParticles() {
    const { mouseInfluence } = this.config;
    
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }

      // Mouse interaction
      if (this.mouse.x && this.mouse.y) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 0.1;
          particle.vy -= Math.sin(angle) * force * 0.1;
        }
      }

      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Minimum speed
      const minSpeed = 0.1;
      if (Math.abs(particle.vx) < minSpeed) {
        particle.vx = (Math.random() - 0.5) * minSpeed * 2;
      }
      if (Math.abs(particle.vy) < minSpeed) {
        particle.vy = (Math.random() - 0.5) * minSpeed * 2;
      }
    });
  }

  drawParticles() {
    const { particleColor } = this.config;
    
    this.ctx.fillStyle = particleColor;
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Add glow effect
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#3b82f6';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });
  }

  drawConnections() {
    const { maxDistance, lineColor } = this.config;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = 1 - (distance / maxDistance);
          this.ctx.strokeStyle = lineColor.replace('0.3', opacity * 0.3);
          this.ctx.lineWidth = opacity * 1.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  drawMouseConnections() {
    if (!this.mouse.x || !this.mouse.y) return;
    
    this.particles.forEach(particle => {
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.mouse.radius) {
        const opacity = 1 - (distance / this.mouse.radius);
        this.ctx.strokeStyle = `rgba(75, 0, 255, ${opacity * 0.7})`;
        this.ctx.lineWidth = opacity * 3;
        this.ctx.beginPath();
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
      }
    });
  }

  animate() {
    if (!this.isInitialized) return;
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
    
    // Clear canvas with fade effect for trail
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    this.drawConnections();
    this.drawMouseConnections();
    this.drawParticles();
  }

  render() {
    // Render is called by the main app loop, but we handle our own animation
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.isInitialized = false;
  }
}

