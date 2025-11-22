// ============================================
// GEOMETRY FIELD
// Grid of rotating geometric shapes
// ============================================

class GeometryField {
  constructor(canvasId = 'particles-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometries = [];
    this.lights = [];
    this.time = 0;
    
    this.init();
  }
  
  async init() {
    await this.waitForThreeJS();
    this.setupScene();
    this.createGeometryGrid();
    this.setupLights();
    this.animate();
  }
  
  waitForThreeJS() {
    return new Promise((resolve) => {
      if (typeof THREE !== 'undefined') {
        resolve();
      } else {
        window.addEventListener('threejs-ready', resolve, { once: true });
      }
    });
  }
  
  setupScene() {
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 20;
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  createGeometryGrid() {
    // Create variety of geometries
    const geometryTypes = [
      new THREE.IcosahedronGeometry(0.7, 0),
      new THREE.OctahedronGeometry(0.8, 0),
      new THREE.TetrahedronGeometry(0.9, 0),
      new THREE.DodecahedronGeometry(0.6, 0),
      new THREE.TorusKnotGeometry(0.4, 0.15, 50, 8),
      new THREE.TorusGeometry(0.5, 0.2, 12, 24)
    ];
    
    const gridSize = 6;
    const spacing = 5;
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < 3; z++) {
          // Pick random geometry for variety
          const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
          
          // Create wireframe for some shapes
          const useWireframe = Math.random() > 0.5;
          
          const material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHSL(0.7 + Math.random() * 0.15, 1, 0.4 + Math.random() * 0.3),
            metalness: 0.9,
            roughness: 0.1,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            emissive: new THREE.Color(0x4B00FF),
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: useWireframe ? 0.6 : 0.85,
            wireframe: useWireframe,
            side: THREE.DoubleSide
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          
          mesh.position.x = (x - gridSize / 2) * spacing;
          mesh.position.y = (y - gridSize / 2) * spacing;
          mesh.position.z = (z - 1.5) * spacing - 10;
          
          // Random initial rotation
          mesh.rotation.x = Math.random() * Math.PI * 2;
          mesh.rotation.y = Math.random() * Math.PI * 2;
          mesh.rotation.z = Math.random() * Math.PI * 2;
          
          mesh.userData = {
            originalPosition: mesh.position.clone(),
            offsetX: x,
            offsetY: y,
            offsetZ: z,
            rotationSpeed: {
              x: (Math.random() - 0.5) * 0.02,
              y: (Math.random() - 0.5) * 0.02,
              z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: 0.3 + Math.random() * 0.5,
            floatAmount: 1 + Math.random() * 2,
            spiralRadius: Math.random() * 2,
            spiralSpeed: Math.random() * 0.5
          };
          
          this.scene.add(mesh);
          this.geometries.push(mesh);
        }
      }
    }
  }
  
  setupLights() {
    const ambient = new THREE.AmbientLight(0x4B00FF, 0.6);
    this.scene.add(ambient);
    
    // Multiple moving lights for dynamic effect
    this.lights = [];
    
    const light1 = new THREE.PointLight(0x4B00FF, 2, 60);
    light1.position.set(15, 15, 15);
    this.scene.add(light1);
    this.lights.push({ light: light1, radius: 15, speed: 0.5, offset: 0 });
    
    const light2 = new THREE.PointLight(0x8B40FF, 2, 60);
    light2.position.set(-15, -15, 15);
    this.scene.add(light2);
    this.lights.push({ light: light2, radius: 15, speed: 0.7, offset: Math.PI });
    
    const light3 = new THREE.PointLight(0x6B20FF, 1.5, 50);
    light3.position.set(0, 0, 20);
    this.scene.add(light3);
    this.lights.push({ light: light3, radius: 10, speed: 0.3, offset: Math.PI / 2 });
    
    // Directional light for depth
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 10);
    this.scene.add(dirLight);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.time += 0.01;
    
    // Animate lights in circular motion
    if (this.lights) {
      this.lights.forEach(lightData => {
        const { light, radius, speed, offset } = lightData;
        light.position.x = Math.cos(this.time * speed + offset) * radius;
        light.position.y = Math.sin(this.time * speed + offset) * radius;
        light.position.z = 10 + Math.sin(this.time * speed * 2 + offset) * 5;
      });
    }
    
    this.geometries.forEach((mesh, i) => {
      const userData = mesh.userData;
      const { offsetX, offsetY, offsetZ, originalPosition, rotationSpeed, floatSpeed, floatAmount, spiralRadius, spiralSpeed } = userData;
      
      // Complex wave motion with multiple frequencies
      const wave1 = Math.sin(this.time * floatSpeed + offsetX * 0.8) * floatAmount;
      const wave2 = Math.cos(this.time * floatSpeed * 0.7 + offsetY * 0.6) * floatAmount * 0.8;
      const wave3 = Math.sin(this.time * floatSpeed * 0.5 + offsetZ * 0.4) * floatAmount * 0.5;
      
      // Spiral motion
      const spiral = Math.sin(this.time * spiralSpeed + i * 0.2) * spiralRadius;
      
      mesh.position.x = originalPosition.x + wave2 + Math.cos(this.time * spiralSpeed + i * 0.1) * spiral;
      mesh.position.y = originalPosition.y + wave1;
      mesh.position.z = originalPosition.z + wave3 + Math.sin(this.time * spiralSpeed + i * 0.1) * spiral;
      
      // Individual rotation speeds
      mesh.rotation.x += rotationSpeed.x;
      mesh.rotation.y += rotationSpeed.y;
      mesh.rotation.z += rotationSpeed.z;
      
      // Dynamic scale with breathing effect
      const breathe = 1 + Math.sin(this.time * 2 + i * 0.15) * 0.15;
      const pulse = Math.sin(this.time * 4 + i * 0.3) * 0.1;
      mesh.scale.set(breathe + pulse, breathe + pulse, breathe + pulse);
      
      // Dynamic emissive with variation
      const emissiveBase = 0.3 + Math.sin(this.time * 2 + i * 0.2) * 0.4;
      const emissiveFlicker = Math.sin(this.time * 8 + i * 0.5) * 0.2;
      mesh.material.emissiveIntensity = emissiveBase + emissiveFlicker;
      
      // Opacity fade based on distance from camera
      const distance = mesh.position.distanceTo(this.camera.position);
      mesh.material.opacity = Math.max(0.3, 1 - (distance / 40));
    });
    
    // Subtle camera rotation for depth
    this.camera.position.x = Math.sin(this.time * 0.1) * 2;
    this.camera.position.y = Math.cos(this.time * 0.15) * 2;
    this.camera.lookAt(0, 0, 0);
    
    this.renderer.render(this.scene, this.camera);
  }
  
  render() {
    // Handled by animate
  }
}

