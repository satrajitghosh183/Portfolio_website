// ============================================
// LOADER
// Counts to 10 then shows 3D graphics demo
// ============================================

class Loader {
  constructor(element) {
    this.element = element;
    this.numberElement = element ? element.querySelector('.loader-number') : null;
    if (!this.numberElement) {
      this.numberElement = document.getElementById('loaderNumber');
    }
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  init3DDemo() {
    if (!this.element) return;
    
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'loader-3d-demo';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.opacity = '0';
    this.canvas.style.transition = 'opacity 1s ease';
    
    this.element.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    const resize = () => {
      this.canvas.width = this.element.offsetWidth;
      this.canvas.height = this.element.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    setTimeout(() => {
      this.canvas.style.opacity = '1';
    }, 100);
  }

  render3D() {
    if (!this.ctx || !this.canvas) return;
    
    const width = this.canvas.width;
    const height = this.canvas.height;
    const time = Date.now() * 0.001;
    
    // Clear with dark background
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw multiple rotating geometric shapes
    this.drawRotatingCube(centerX - 200, centerY, time, 80);
    this.drawRotatingOctahedron(centerX + 200, centerY, time * 1.5, 70);
    this.drawRotatingTorus(centerX, centerY - 150, time * 0.8, 60);
    this.drawParticleField(centerX, centerY, time);
    
    // Draw energy beams connecting shapes
    this.drawEnergyBeam(centerX - 200, centerY, centerX + 200, centerY, time);
    this.drawEnergyBeam(centerX - 200, centerY, centerX, centerY - 150, time + Math.PI);
    this.drawEnergyBeam(centerX + 200, centerY, centerX, centerY - 150, time + Math.PI * 0.5);
    
    // Draw glow effect at center
    const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
    gradient.addColorStop(0, 'rgba(75, 0, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(75, 0, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(75, 0, 255, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    
    this.animationId = requestAnimationFrame(() => this.render3D());
  }
  
  drawRotatingCube(x, y, time, size) {
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];
    
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];
    
    const rotated = vertices.map(v => this.rotate3D(v, time, time * 0.7, time * 0.5));
    const projected = rotated.map(v => this.project3D(v, x, y, size));
    
    this.ctx.strokeStyle = 'rgba(75, 0, 255, 0.8)';
    this.ctx.lineWidth = 2;
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = '#4B00FF';
    
    edges.forEach(([start, end]) => {
      this.ctx.beginPath();
      this.ctx.moveTo(projected[start][0], projected[start][1]);
      this.ctx.lineTo(projected[end][0], projected[end][1]);
      this.ctx.stroke();
    });
    
    this.ctx.shadowBlur = 0;
  }
  
  drawRotatingOctahedron(x, y, time, size) {
    const vertices = [
      [0, 1, 0], [0, -1, 0],
      [1, 0, 0], [-1, 0, 0],
      [0, 0, 1], [0, 0, -1]
    ];
    
    const edges = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2]
    ];
    
    const rotated = vertices.map(v => this.rotate3D(v, time * 0.8, time, time * 1.2));
    const projected = rotated.map(v => this.project3D(v, x, y, size));
    
    this.ctx.strokeStyle = 'rgba(139, 64, 255, 0.8)';
    this.ctx.lineWidth = 2;
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = '#8B40FF';
    
    edges.forEach(([start, end]) => {
      this.ctx.beginPath();
      this.ctx.moveTo(projected[start][0], projected[start][1]);
      this.ctx.lineTo(projected[end][0], projected[end][1]);
      this.ctx.stroke();
    });
    
    this.ctx.shadowBlur = 0;
  }
  
  drawRotatingTorus(x, y, time, size) {
    const numPoints = 30;
    const innerRadius = 0.4;
    
    for (let i = 0; i < numPoints; i++) {
      const angle1 = (i / numPoints) * Math.PI * 2;
      const angle2 = angle1 + time * 2;
      
      const cx = Math.cos(angle1);
      const cy = Math.sin(angle1);
      
      const px = cx * (1 + innerRadius * Math.cos(angle2));
      const py = cy * (1 + innerRadius * Math.cos(angle2));
      const pz = innerRadius * Math.sin(angle2);
      
      const rotated = this.rotate3D([px, py, pz], time, time * 1.5, 0);
      const projected = this.project3D(rotated, x, y, size);
      
      const alpha = 0.5 + (rotated[2] + 1) * 0.25;
      this.ctx.fillStyle = `rgba(107, 32, 255, ${alpha})`;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = '#6B20FF';
      
      this.ctx.beginPath();
      this.ctx.arc(projected[0], projected[1], 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.shadowBlur = 0;
  }
  
  drawParticleField(centerX, centerY, time) {
    const numParticles = 100;
    
    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2 + time * 0.5;
      const radius = 150 + Math.sin(time + i * 0.1) * 50;
      const z = Math.sin(angle * 3 + time) * 0.5;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius * 0.5 + z * 100;
      
      const size = 1 + z * 2;
      const alpha = 0.2 + z * 0.5;
      
      this.ctx.fillStyle = `rgba(75, 0, 255, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  drawEnergyBeam(x1, y1, x2, y2, time) {
    const segments = 20;
    const waveAmplitude = 10;
    
    this.ctx.strokeStyle = 'rgba(75, 0, 255, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#4B00FF';
    
    this.ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      
      const wave = Math.sin(t * Math.PI * 4 + time * 3) * waveAmplitude;
      const offsetX = -(y2 - y1) / Math.hypot(x2 - x1, y2 - y1) * wave;
      const offsetY = (x2 - x1) / Math.hypot(x2 - x1, y2 - y1) * wave;
      
      if (i === 0) {
        this.ctx.moveTo(x + offsetX, y + offsetY);
      } else {
        this.ctx.lineTo(x + offsetX, y + offsetY);
      }
    }
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }
  
  rotate3D(vertex, angleX, angleY, angleZ) {
    let [x, y, z] = vertex;
    
    // Rotate around X
    let y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
    let z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
    
    // Rotate around Y
    let x2 = x * Math.cos(angleY) - z1 * Math.sin(angleY);
    let z2 = x * Math.sin(angleY) + z1 * Math.cos(angleY);
    
    // Rotate around Z
    let x3 = x2 * Math.cos(angleZ) - y1 * Math.sin(angleZ);
    let y3 = x2 * Math.sin(angleZ) + y1 * Math.cos(angleZ);
    
    return [x3, y3, z2];
  }
  
  project3D(vertex, centerX, centerY, scale) {
    const [x, y, z] = vertex;
    const perspective = 4;
    const factor = perspective / (perspective + z);
    
    return [
      centerX + x * scale * factor,
      centerY + y * scale * factor
    ];
  }

  animate(duration = 3000) {
    return new Promise((resolve) => {
      if (!this.numberElement) {
        resolve();
        return;
      }

      const stepDuration = duration / this.values.length;
      let count = 0;

      const interval = setInterval(() => {
        const value = this.values[count];
        if (this.numberElement) {
          this.numberElement.textContent = value;
        }

        count++;

        if (count >= this.values.length) {
          clearInterval(interval);
          this.numberElement.style.opacity = '0';
          this.numberElement.style.transition = 'opacity 0.5s ease';
          
          setTimeout(() => {
            this.init3DDemo();
            this.render3D();
            setTimeout(() => this.hide(resolve), 2000);
          }, 500);
        }
      }, stepDuration);
    });
  }

  hide(callback) {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.element) {
      this.element.classList.add('hidden');
      setTimeout(() => {
        if (this.element) {
          this.element.style.display = 'none';
        }
        if (callback) callback();
      }, 800);
    } else if (callback) {
      callback();
    }
  }
}

