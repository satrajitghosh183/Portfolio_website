// ============================================
// MORPHING BACKGROUND BLOBS
// Animated SVG blobs that morph and move
// ============================================

class MorphingBackground {
  constructor() {
    this.container = null;
    this.blobs = [];
    this.init();
  }
  
  init() {
    this.createContainer();
    this.createBlobs(5);
    this.animate();
  }
  
  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'morphing-background';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
      overflow: hidden;
    `;
    document.body.appendChild(this.container);
  }
  
  createBlobs(count) {
    for (let i = 0; i < count; i++) {
      const blob = document.createElement('div');
      blob.className = 'morph-blob';
      
      const size = 300 + Math.random() * 400;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      blob.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(75, 0, 255, 0.15) 0%, rgba(107, 32, 255, 0.05) 50%, transparent 70%);
        border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        filter: blur(40px);
        animation: morphBlob ${15 + Math.random() * 10}s ease-in-out infinite, 
                   floatBlob ${20 + Math.random() * 15}s ease-in-out infinite;
        opacity: 0.6;
      `;
      
      this.container.appendChild(blob);
      this.blobs.push({ element: blob, x, y, size });
    }
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.blobs.forEach((blob, i) => {
      const time = Date.now() * 0.0005;
      const offsetX = Math.sin(time + i) * 100;
      const offsetY = Math.cos(time + i * 0.7) * 100;
      
      blob.element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + Math.sin(time * 0.5 + i) * 0.2})`;
    });
  }
}

