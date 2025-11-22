// ============================================
// 3D PHYSICS SIMULATION
// Interactive 3D objects with physics and mouse interaction
// ============================================

class Physics3D {
  constructor(canvasId = 'helix-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Canvas not found');
      return;
    }
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.objects = [];
    this.chainLinks = [];
    this.windTime = 0;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.selectedObject = null;
    
    this.init();
  }
  
  async init() {
    await this.waitForThreeJS();
    this.setupScene();
    this.createObjects();
    this.setupLights();
    this.setupInteraction();
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
    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 50, 150);
    
    // Camera - positioned to see the chain clearly on the left
    this.camera = new THREE.PerspectiveCamera(
      60,  // Moderate FOV for better visibility
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 35);  // Slightly raised, further back
    this.camera.lookAt(-5, 5, 0);  // Look slightly left of center
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    
    // Resize handler
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  createObjects() {
    // Create a HUGE hanging chain on the LEFT edge
    const numLinks = 7;  // 7 links for 7 sections
    const linkRadius = 2.5;  // MASSIVE links!
    const linkThickness = 0.7;  // THICK!
    const linkSpacing = 4.5;  // BIG gaps between links
    
    // Starting position - FAR LEFT EDGE (screen coordinates)
    const startX = -35; // Far left edge, clearly visible
    const startY = 15;   // Start high, hanging down vertically
    const startZ = 0;   // At center depth for clear visibility
    
    this.chainLinks = [];
    this.windTime = 0;
    this.lastScrollY = 0;
    
    // Sections in order: about, experience, work, publications, awards, resume, contact
    for (let i = 0; i < numLinks; i++) {
      // Create torus (ring) for chain link
      const geometry = new THREE.TorusGeometry(linkRadius, linkThickness, 24, 48);
      
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x4B00FF),
        metalness: 0.95,
        roughness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: new THREE.Color(0x4B00FF),
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
      });
      
      const link = new THREE.Mesh(geometry, material);
      
      // Position links vertically, alternating rotation
      link.position.x = startX;
      link.position.y = startY - i * linkSpacing;
      link.position.z = startZ;
      
      // Alternate rotation for realistic chain
      if (i % 2 === 0) {
        link.rotation.y = Math.PI / 2;
      }
      
      // Physics properties
      link.userData = {
        index: i,
        basePosition: link.position.clone(),
        swayOffset: 0,
        swaySpeed: 0.5 + Math.random() * 0.3,
        swayAmount: 0.8 + (i * 0.3),
        rotationOffset: Math.random() * Math.PI * 2,
        targetScale: 1,
        isHovered: false,
        sectionIndex: i,  // Top link (0) = about, Bottom link (6) = contact
        // Falling physics
        isFalling: false,
        fallVelocity: new THREE.Vector3(0, 0, 0),
        fallRotationSpeed: new THREE.Vector3(0, 0, 0)
      };
      
      this.scene.add(link);
      this.objects.push(link);
      this.chainLinks.push(link);
    }
    
    // Setup scroll listener for reforming chain
    this.setupScrollListener();
  }
  
  setupLights() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x4B00FF, 1.5);
    this.scene.add(ambient);
    
    // Point lights focused on the chain on left edge
    const light1 = new THREE.PointLight(0x4B00FF, 30, 300);
    light1.position.set(-18, 18, 10);  // Above chain, matching position
    this.scene.add(light1);
    
    const light2 = new THREE.PointLight(0x8B40FF, 25, 250);
    light2.position.set(-18, 8, 15);  // In front of chain
    this.scene.add(light2);
    
    const light3 = new THREE.PointLight(0x6B20FF, 20, 200);
    light3.position.set(-18, 0, 5);  // Below chain
    this.scene.add(light3);
    
    // Directional light from front
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(-20, 20, 30);
    this.scene.add(dirLight);
  }
  
  setupInteraction() {
    // Get all section IDs for navigation
    this.sections = ['about', 'experience', 'work', 'publications', 'awards', 'resume', 'contact'];
    
    this.isOverChain = false;
    
    // Mouse move
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Highlight chain links on hover (only non-falling ones)
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(
        this.objects.filter(obj => !obj.userData.isFalling)
      );
      
      // Reset all links
      this.objects.forEach(obj => {
        if (!obj.userData.isFalling) {
          obj.userData.isHovered = false;
          obj.material.emissiveIntensity = 0.5;
        }
      });
      
      if (intersects.length > 0) {
        const link = intersects[0].object;
        link.userData.isHovered = true;
        link.material.emissive = new THREE.Color(0x8B40FF);
        link.material.emissiveIntensity = 1.5;
        document.body.style.cursor = 'pointer';
        this.isOverChain = true;
        
        // Enable pointer events on canvas when over chain
        if (this.canvas) {
          this.canvas.style.pointerEvents = 'auto';
        }
      } else {
        document.body.style.cursor = 'default';
        this.isOverChain = false;
        
        // Disable pointer events on canvas when not over chain
        if (this.canvas) {
          this.canvas.style.pointerEvents = 'none';
        }
      }
    });
    
    // Click interaction - Navigate to sections!
    window.addEventListener('click', () => {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(
        this.objects.filter(obj => !obj.userData.isFalling)
      );
      
      if (intersects.length > 0) {
        const link = intersects[0].object;
        const sectionId = this.sections[link.userData.sectionIndex];
        
        // Make link FALL OFF!
        link.userData.isFalling = true;
        link.userData.fallVelocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          0,
          (Math.random() - 0.5) * 0.3
        );
        link.userData.fallRotationSpeed = new THREE.Vector3(
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15
        );
        
        // Flash effect
        link.material.emissive = new THREE.Color(0xFFFFFF);
        link.material.emissiveIntensity = 3;
        
        setTimeout(() => {
          link.material.emissive = new THREE.Color(0x4B00FF);
          link.material.emissiveIntensity = 0.5;
        }, 200);
        
        // Send shockwave
        this.objects.forEach((otherLink, i) => {
          if (!otherLink.userData.isFalling) {
            const delay = Math.abs(link.userData.index - i) * 50;
            setTimeout(() => {
              otherLink.userData.targetScale = 1.3;
              setTimeout(() => {
                otherLink.userData.targetScale = 1;
              }, 200);
            }, delay);
          }
        });
        
        // Navigate to section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
  
  setupScrollListener() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Check if scrolling up and near top
      if (currentScrollY < lastScrollY && currentScrollY < 500) {
        // Reform the chain! Bring fallen links back
        this.reformChain();
      }
      
      lastScrollY = currentScrollY;
    });
  }
  
  reformChain() {
    this.chainLinks.forEach((link, index) => {
      if (link.userData.isFalling) {
        // Stop falling
        link.userData.isFalling = false;
        
        // Animate back to original position
        const delay = index * 100;
        setTimeout(() => {
          this.animateLinkBack(link);
        }, delay);
      }
    });
  }
  
  animateLinkBack(link) {
    const startPos = link.position.clone();
    const startRot = {
      x: link.rotation.x,
      y: link.rotation.y,
      z: link.rotation.z
    };
    const targetPos = link.userData.basePosition.clone();
    const targetRot = {
      x: link.userData.index % 2 === 0 ? 0 : 0,
      y: link.userData.index % 2 === 0 ? Math.PI / 2 : 0,
      z: 0
    };
    
    const duration = 1000; // 1 second
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate position
      link.position.lerpVectors(startPos, targetPos, easeProgress);
      
      // Interpolate rotation
      link.rotation.x = startRot.x + (targetRot.x - startRot.x) * easeProgress;
      link.rotation.y = startRot.y + (targetRot.y - startRot.y) * easeProgress;
      link.rotation.z = startRot.z + (targetRot.z - startRot.z) * easeProgress;
      
      // Flash effect
      link.material.emissiveIntensity = 0.5 + (1 - easeProgress) * 1;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Reset velocities
        link.userData.fallVelocity.set(0, 0, 0);
        link.userData.fallRotationSpeed.set(0, 0, 0);
        link.userData.swayOffset = 0;
      }
    };
    
    animate();
  }
  
  updatePhysics() {
    // Update wind effect
    this.windTime += 0.016;
    
    // Simulate wind blowing the chain
    const windStrength = Math.sin(this.windTime * 0.5) * 0.5 + Math.sin(this.windTime * 1.3) * 0.3;
    const windDirection = Math.sin(this.windTime * 0.3) * 0.5;
    
    this.chainLinks.forEach((link, index) => {
      const userData = link.userData;
      
      // Check if link is falling
      if (userData.isFalling) {
        // Apply gravity
        userData.fallVelocity.y -= 0.02;
        
        // Apply velocity
        link.position.add(userData.fallVelocity);
        
        // Apply rotation
        link.rotation.x += userData.fallRotationSpeed.x;
        link.rotation.y += userData.fallRotationSpeed.y;
        link.rotation.z += userData.fallRotationSpeed.z;
        
        // Fade out as it falls
        link.material.opacity = Math.max(0, 1 - (userData.basePosition.y - link.position.y) / 20);
        
        // Remove if fallen too far
        if (link.position.y < -30) {
          link.visible = false;
        }
        
        return; // Skip normal physics
      }
      
      // Make sure link is visible if not falling
      link.visible = true;
      link.material.opacity = 0.9;
      
      // Calculate pendulum effect - lower links move more
      const tension = 0.05;
      const damping = 0.96;
      
      // Wind effect gets stronger down the chain
      const windEffect = windStrength * userData.swayAmount;
      const horizontalForce = windEffect + windDirection * 0.2;
      
      // Pendulum motion
      const displacement = link.position.x - userData.basePosition.x;
      userData.swayOffset += horizontalForce - displacement * tension;
      userData.swayOffset *= damping;
      
      // Apply sway
      link.position.x = userData.basePosition.x + userData.swayOffset;
      link.position.y = userData.basePosition.y;
      link.position.z = userData.basePosition.z + Math.sin(this.windTime * userData.swaySpeed + userData.rotationOffset) * userData.swayAmount * 0.5;
      
      // Rotate link based on wind
      const targetRotationZ = userData.swayOffset * 0.3;
      link.rotation.z += (targetRotationZ - link.rotation.z) * 0.05;
      
      // Slight continuous rotation
      if (index % 2 === 0) {
        link.rotation.y += 0.002;
      } else {
        link.rotation.x += 0.002;
      }
      
      // Smooth scale animation for interactions
      const currentScale = link.scale.x;
      const targetScale = userData.targetScale || 1;
      link.scale.setScalar(currentScale + (targetScale - currentScale) * 0.15);
      
      // Update emissive intensity for hover effect
      if (!userData.isHovered) {
        link.material.emissiveIntensity += (0.5 - link.material.emissiveIntensity) * 0.1;
      }
    });
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.updatePhysics();
    
    // Subtle camera movement based on mouse for parallax
    const targetX = 0 + this.mouse.x * 2;
    const targetY = 5 + this.mouse.y * 2;
    
    this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
    this.camera.lookAt(-5, 5, 0);  // Keep looking at the chain area
    
    this.renderer.render(this.scene, this.camera);
  }
  
  render() {
    // Called by main app loop but we handle our own animation
  }
}

