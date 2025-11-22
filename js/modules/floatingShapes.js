// ============================================
// FLOATING 3D SHAPES
// CSS 3D floating geometric shapes
// ============================================

class FloatingShapes {
  constructor(containerId = 'floating-shapes') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      // Create container if it doesn't exist
      this.container = document.createElement('div');
      this.container.id = containerId;
      this.container.className = 'floating-shapes-container';
      document.body.appendChild(this.container);
    }

    this.shapes = [];
    this.shapeCount = 8;
    this.time = 0;

    this.initShapes();
  }

  initShapes() {
    if (!this.container) return;
    const shapes = ['cube', 'sphere', 'pyramid', 'octahedron'];
    
    for (let i = 0; i < this.shapeCount; i++) {
      const shape = document.createElement('div');
      const shapeType = shapes[i % shapes.length];
      shape.className = `floating-shape floating-shape-${shapeType}`;
      
      // Distribute shapes more evenly across the viewport
      const angle = (Math.PI * 2 * i) / this.shapeCount;
      const radius = 40 + Math.random() * 10;
      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 300;
      
      shape.style.left = `${x}%`;
      shape.style.top = `${y}%`;
      shape.style.setProperty('--z', z);
      
      // Varied sizes for depth
      const baseSize = 15 + (i % 3) * 10;
      const size = baseSize + Math.random() * 15;
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      
      // Random animation delays for staggered motion
      shape.style.setProperty('--delay', Math.random() * 2);
      shape.style.setProperty('--speed', 0.3 + Math.random() * 0.7);
      
      // Add glow effect based on depth
      const glowIntensity = (1 - Math.abs(z) / 300) * 0.3;
      shape.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, ${glowIntensity})`;
      
      this.container.appendChild(shape);
      
      this.shapes.push({
        element: shape,
        baseX: x,
        baseY: y,
        baseZ: z,
        originalSize: size,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        rotationX: Math.random() * 360,
        rotationY: Math.random() * 360,
        rotationZ: Math.random() * 360,
        rotationSpeedX: (Math.random() - 0.5) * 3,
        rotationSpeedY: (Math.random() - 0.5) * 3,
        rotationSpeedZ: (Math.random() - 0.5) * 3,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  update() {
    this.time += 0.016; // ~60fps

    if (!this.container || this.shapes.length === 0) return;

    this.shapes.forEach((shape, i) => {
      if (!shape.element) return;

      // Complex floating motion with multiple sine waves
      const wave1 = Math.sin(this.time * 0.8 + shape.phase) * 8;
      const wave2 = Math.cos(this.time * 1.2 + shape.phase * 1.5) * 5;
      const wave3 = Math.sin(this.time * 0.5 + i) * 3;
      
      const x = shape.baseX + wave1 + wave3;
      const y = shape.baseY + wave2 + Math.cos(this.time * 0.7 + i) * 4;
      
      // Z-depth breathing effect
      const zBreath = Math.sin(this.time * 0.6 + shape.phase) * 30;
      const z = shape.baseZ + zBreath;

      // Update rotation with varying speeds
      shape.rotationX += shape.rotationSpeedX * 0.016 * (1 + Math.sin(this.time + i) * 0.3);
      shape.rotationY += shape.rotationSpeedY * 0.016 * (1 + Math.cos(this.time + i) * 0.3);
      shape.rotationZ += shape.rotationSpeedZ * 0.016 * (1 + Math.sin(this.time * 0.8 + i) * 0.2);

      // Apply scroll-based transformations if available
      let scrollRotation = shape.scrollRotation || 0;
      let scrollScale = shape.scrollScale || 1;
      
      // Decay scroll effects
      if (shape.scrollRotation !== undefined) {
        shape.scrollRotation *= 0.95;
      }
      if (shape.scrollScale !== undefined) {
        shape.scrollScale += (1 - shape.scrollScale) * 0.1;
      }
      
      // Scale pulsing based on depth and time
      const scalePulse = 1 + Math.sin(this.time * 1.5 + shape.phase) * 0.15;
      const depthScale = 1 + (z / 300) * 0.3;
      const scale = scalePulse * depthScale * scrollScale;

      // Update opacity based on depth
      const opacity = 0.1 + (1 - Math.abs(z) / 300) * 0.15;

      // Apply transforms including scroll rotation
      shape.element.style.left = `${x}%`;
      shape.element.style.top = `${y}%`;
      shape.element.style.setProperty('--z', z);
      shape.element.style.setProperty('--rotateX', `${shape.rotationX}deg`);
      shape.element.style.setProperty('--rotateY', `${shape.rotationY + scrollRotation}deg`);
      shape.element.style.setProperty('--rotateZ', `${shape.rotationZ}deg`);
      shape.element.style.setProperty('--scale', scale);
      shape.element.style.opacity = opacity;
      
      // Update glow intensity
      const glowIntensity = opacity * 0.5;
      const size = shape.originalSize * scale;
      shape.element.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, ${glowIntensity})`;
    });
  }

  render() {
    this.update();
  }

  destroy() {
    if (this.container) {
      this.container.remove();
    }
  }
}

