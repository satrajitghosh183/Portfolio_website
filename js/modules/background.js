// ============================================
// ADVANCED SMOOTH COLOR BACKGROUND
// Canvas-based background with noise and gradients
// ============================================

class SmoothColorBackground {
  constructor(canvasId = 'bg-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.noiseCanvas = null;
    this.noiseCtx = null;
    this.time = 0;

    this.current = { r: 0, g: 0, b: 0 };
    this.target = { r: 0, g: 0, b: 0 };
    this.speed = 0.05;

    this.resize();
    this.initNoise();
    window.addEventListener('resize', utils.debounce(() => {
      this.resize();
      this.initNoise();
    }, 250));

    // Setup section color observers
    this.setupSectionObservers();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initNoise() {
    // Create noise canvas for texture
    this.noiseCanvas = document.createElement('canvas');
    this.noiseCanvas.width = this.canvas.width;
    this.noiseCanvas.height = this.canvas.height;
    this.noiseCtx = this.noiseCanvas.getContext('2d');
    
    // Generate subtle noise texture
    const imageData = this.noiseCtx.createImageData(this.noiseCanvas.width, this.noiseCanvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const value = Math.random() * 5 - 2.5;
      imageData.data[i] = 0;     // R
      imageData.data[i + 1] = 0; // G
      imageData.data[i + 2] = 0; // B
      imageData.data[i + 3] = Math.abs(value); // A
    }
    this.noiseCtx.putImageData(imageData, 0, 0);
  }

  setupSectionObservers() {
    const sections = document.querySelectorAll('section[data-color]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const colorHex = entry.target.getAttribute('data-color');
            if (colorHex) {
              this.setTargetHex(colorHex);
            }
          }
        });
      },
      { 
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    sections.forEach(section => observer.observe(section));
  }

  setTargetColor(r, g, b) {
    this.target = { r, g, b };
  }

  setTargetHex(hex) {
    const rgb = utils.hexToRgb(hex);
    this.setTargetColor(rgb.r, rgb.g, rgb.b);
  }

  render() {
    if (!this.canvas || !this.ctx) return;

    this.time += 0.005;

    // Smoothly interpolate to target color
    this.current.r = utils.lerp(this.current.r, this.target.r, this.speed);
    this.current.g = utils.lerp(this.current.g, this.target.g, this.speed);
    this.current.b = utils.lerp(this.current.b, this.target.b, this.speed);

    const { r, g, b } = this.current;
    
    // Create radial gradient overlay for depth
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(this.canvas.width, this.canvas.height) * 0.8
    );
    
    const baseColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    const darkerColor = `rgb(${Math.round(r * 0.8)}, ${Math.round(g * 0.8)}, ${Math.round(b * 0.8)})`;
    
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(0.6, baseColor);
    gradient.addColorStop(1, darkerColor);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add subtle animated gradient overlay
    const overlayGradient = this.ctx.createLinearGradient(
      Math.sin(this.time) * this.canvas.width * 0.3 + this.canvas.width / 2,
      Math.cos(this.time) * this.canvas.height * 0.3 + this.canvas.height / 2,
      Math.sin(this.time + Math.PI) * this.canvas.width * 0.3 + this.canvas.width / 2,
      Math.cos(this.time + Math.PI) * this.canvas.height * 0.3 + this.canvas.height / 2
    );
    
    overlayGradient.addColorStop(0, `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.02)`);
    overlayGradient.addColorStop(0.5, `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0)`);
    overlayGradient.addColorStop(1, `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.02)`);
    
    this.ctx.fillStyle = overlayGradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add subtle noise texture
    if (this.noiseCanvas && this.noiseCtx) {
      this.ctx.globalAlpha = 0.03;
      this.ctx.drawImage(this.noiseCanvas, 0, 0);
      this.ctx.globalAlpha = 1.0;
    }
  }
}

