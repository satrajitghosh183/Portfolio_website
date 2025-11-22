// ============================================
// ADVANCED PARTICLE SYSTEM WITH FLUID DYNAMICS
// High-performance particle system with advanced visual effects
// ============================================

class AdvancedParticles {
  constructor(canvasId = 'particles-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 200 };
    this.flowField = [];
    this.time = 0;
    
    this.config = {
      particleCount: 200,
      flowFieldResolution: 18,
      noiseScale: 0.003,
      flowSpeed: 0.8,
      particleSize: 3,
      trailLength: 0.08,
      connectionDistance: 140,
      mouseForce: 0.5
    };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createParticles();
    this.createFlowField();
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
    
    window.addEventListener('resize', utils.debounce(() => {
      this.resize();
      this.createFlowField();
    }, 250));
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.cols = Math.floor(this.canvas.width / this.config.flowFieldResolution);
    this.rows = Math.floor(this.canvas.height / this.config.flowFieldResolution);
  }
  
  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: 0,
        vy: 0,
        history: [],
        hue: 260 + Math.random() * 30, // Purple-violet hues (#4B00FF is around 265° hue)
        size: Math.random() * this.config.particleSize + 1,
        alpha: Math.random() * 0.4 + 0.6
      });
    }
  }
  
  createFlowField() {
    this.flowField = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const angle = this.noise(x * this.config.noiseScale, y * this.config.noiseScale, this.time) * Math.PI * 2;
        this.flowField.push({
          x: Math.cos(angle),
          y: Math.sin(angle)
        });
      }
    }
  }
  
  // Perlin-like noise function
  noise(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    
    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);
    
    return this.lerp(w,
      this.lerp(v,
        this.lerp(u, this.grad(X, Y, Z), this.grad(X + 1, Y, Z)),
        this.lerp(u, this.grad(X, Y + 1, Z), this.grad(X + 1, Y + 1, Z))
      ),
      this.lerp(v,
        this.lerp(u, this.grad(X, Y, Z + 1), this.grad(X + 1, Y, Z + 1)),
        this.lerp(u, this.grad(X, Y + 1, Z + 1), this.grad(X + 1, Y + 1, Z + 1))
      )
    );
  }
  
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  lerp(t, a, b) {
    return a + t * (b - a);
  }
  
  grad(x, y, z) {
    const h = (x * 374761393 + y * 668265263 + z * 1274126177) & 15;
    return Math.sin(h);
  }
  
  updateParticles() {
    this.time += 0.001;
    
    this.particles.forEach(particle => {
      // Get flow field influence
      const col = Math.floor(particle.x / this.config.flowFieldResolution);
      const row = Math.floor(particle.y / this.config.flowFieldResolution);
      const index = col + row * this.cols;
      
      if (this.flowField[index]) {
        particle.vx += this.flowField[index].x * this.config.flowSpeed;
        particle.vy += this.flowField[index].y * this.config.flowSpeed;
      }
      
      // Mouse interaction
      if (this.mouse.x && this.mouse.y) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * this.config.mouseForce;
          particle.vy -= Math.sin(angle) * force * this.config.mouseForce;
        }
      }
      
      // Apply velocity
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Damping
      particle.vx *= 0.95;
      particle.vy *= 0.95;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Update history for trails
      particle.history.push({ x: particle.x, y: particle.y });
      if (particle.history.length > 20) {
        particle.history.shift();
      }
    });
    
    // Update flow field periodically
    if (Math.random() < 0.01) {
      this.createFlowField();
    }
  }
  
  drawParticles() {
    // Draw trails
    this.particles.forEach(particle => {
      if (particle.history.length > 1) {
        this.ctx.strokeStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.alpha * 0.3})`;
        this.ctx.lineWidth = particle.size * 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(particle.history[0].x, particle.history[0].y);
        
        for (let i = 1; i < particle.history.length; i++) {
          this.ctx.lineTo(particle.history[i].x, particle.history[i].y);
        }
        this.ctx.stroke();
      }
      
      // Draw particle with enhanced glow
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 4
      );
      gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 75%, ${particle.alpha})`);
      gradient.addColorStop(0.4, `hsla(${particle.hue}, 95%, 65%, ${particle.alpha * 0.7})`);
      gradient.addColorStop(0.8, `hsla(${particle.hue}, 85%, 55%, ${particle.alpha * 0.3})`);
      gradient.addColorStop(1, `hsla(${particle.hue}, 75%, 45%, 0)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.config.connectionDistance) {
          const opacity = (1 - dist / this.config.connectionDistance) * 0.3;
          const avgHue = (this.particles[i].hue + this.particles[j].hue) / 2;
          
          const gradient = this.ctx.createLinearGradient(
            this.particles[i].x, this.particles[i].y,
            this.particles[j].x, this.particles[j].y
          );
          gradient.addColorStop(0, `hsla(${avgHue}, 80%, 60%, ${opacity})`);
          gradient.addColorStop(1, `hsla(${avgHue}, 80%, 60%, ${opacity * 0.5})`);
          
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
  
  render() {
    // Clear with trail effect
    this.ctx.fillStyle = `rgba(0, 0, 0, ${this.config.trailLength})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();
  }
}

