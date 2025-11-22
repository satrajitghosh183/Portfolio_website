// ============================================
// ADVANCED GRADIENT BLOBS / MORPHING SHAPES
// Beautiful morphing blobs with smooth animations
// ============================================

class GradientBlobs {
  constructor(canvasId = 'blobs-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.blobs = [];
    this.time = 0;
    this.morphSpeed = 0.003;

    this.resize();
    this.initBlobs();

    window.addEventListener('resize', utils.debounce(() => this.resize(), 250));
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initBlobs();
  }

  initBlobs() {
    if (!this.canvas) return;
    
    // More dynamic color palettes
    this.blobs = [
      {
        x: this.canvas.width * 0.15,
        y: this.canvas.height * 0.25,
        baseX: this.canvas.width * 0.15,
        baseY: this.canvas.height * 0.25,
        radius: 280,
        baseRadius: 280,
        vx: 0.08,
        vy: 0.06,
        color: { r: 255, g: 107, b: 107 }, // Primary gradient color
        targetColor: { r: 255, g: 230, b: 109 },
        phase: 0,
      },
      {
        x: this.canvas.width * 0.85,
        y: this.canvas.height * 0.75,
        baseX: this.canvas.width * 0.85,
        baseY: this.canvas.height * 0.75,
        radius: 320,
        baseRadius: 320,
        vx: -0.06,
        vy: -0.08,
        color: { r: 78, g: 205, b: 196 }, // Secondary gradient color
        targetColor: { r: 167, g: 139, b: 250 },
        phase: Math.PI / 3,
      },
      {
        x: this.canvas.width * 0.5,
        y: this.canvas.height * 0.9,
        baseX: this.canvas.width * 0.5,
        baseY: this.canvas.height * 0.9,
        radius: 240,
        baseRadius: 240,
        vx: 0.04,
        vy: -0.05,
        color: { r: 167, g: 139, b: 250 }, // Purple gradient color
        targetColor: { r: 96, g: 165, b: 250 },
        phase: Math.PI * 2 / 3,
      },
      {
        x: this.canvas.width * 0.3,
        y: this.canvas.height * 0.7,
        baseX: this.canvas.width * 0.3,
        baseY: this.canvas.height * 0.7,
        radius: 200,
        baseRadius: 200,
        vx: -0.05,
        vy: 0.07,
        color: { r: 96, g: 165, b: 250 }, // Blue gradient color
        targetColor: { r: 255, g: 107, b: 107 },
        phase: Math.PI,
      },
    ];
  }

  update() {
    if (!this.canvas || !this.ctx) return;

    this.time += this.morphSpeed;

    // Clear with subtle fade for morphing trails - lighter for better visibility
    this.ctx.fillStyle = 'rgba(10, 10, 10, 0.03)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw blobs with morphing
    this.blobs.forEach((blob, i) => {
      // Organic noise-based movement
      const noiseX = Math.sin(this.time * 0.8 + blob.phase) * Math.cos(this.time * 0.6 + i);
      const noiseY = Math.cos(this.time * 0.8 + blob.phase) * Math.sin(this.time * 0.6 + i);
      
      // Apply scroll-based offset if available
      let scrollOffsetX = blob.scrollOffsetX || 0;
      let scrollOffsetY = blob.scrollOffsetY || 0;
      
      blob.x = blob.baseX + noiseX * 150 + scrollOffsetX;
      blob.y = blob.baseY + noiseY * 100 + scrollOffsetY;
      
      // Decay scroll offsets
      if (blob.scrollOffsetX !== undefined) {
        blob.scrollOffsetX *= 0.95;
      }
      if (blob.scrollOffsetY !== undefined) {
        blob.scrollOffsetY *= 0.95;
      }

      // Morph radius with multiple sine waves for organic feel
      const radiusWave1 = Math.sin(this.time * 0.7 + blob.phase) * 30;
      const radiusWave2 = Math.cos(this.time * 1.1 + blob.phase * 1.3) * 20;
      const radiusWave3 = Math.sin(this.time * 0.5 + blob.phase * 0.7) * 15;
      blob.radius = blob.baseRadius + radiusWave1 + radiusWave2 + radiusWave3;

      // Color interpolation for smooth morphing
      const colorPhase = (this.time + blob.phase) % (Math.PI * 2);
      const colorBlend = (Math.sin(colorPhase) + 1) / 2;
      
      const r = Math.round(utils.lerp(blob.color.r, blob.targetColor.r, colorBlend));
      const g = Math.round(utils.lerp(blob.color.g, blob.targetColor.g, colorBlend));
      const b = Math.round(utils.lerp(blob.color.b, blob.targetColor.b, colorBlend));

      // Create multiple gradient layers for depth - much reduced brightness
      const layers = 4;
      for (let layer = 0; layer < layers; layer++) {
        const layerRadius = blob.radius * (1 - layer * 0.25);
        const layerAlpha = (0.12 - layer * 0.02) * (1 + Math.sin(this.time * 0.8 + blob.phase) * 0.3);
        
        const gradient = this.ctx.createRadialGradient(
          blob.x, blob.y, layerRadius * 0.1,
          blob.x, blob.y, layerRadius
        );

        // Vary opacity based on distance from center - much dimmed
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${layerAlpha})`);
        gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${layerAlpha * 0.9})`);
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${layerAlpha * 0.6})`);
        gradient.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, ${layerAlpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        this.ctx.beginPath();
        this.ctx.arc(blob.x, blob.y, layerRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Add blend mode for mixing
        if (layer === 0) {
          this.ctx.globalCompositeOperation = 'screen';
        }
      }
      
      // Reset composite operation
      this.ctx.globalCompositeOperation = 'source-over';
    });
  }

  render() {
    this.update();
  }
}

