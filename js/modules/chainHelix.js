// ============================================
// INTERACTIVE CHAIN-LINK HELIX
// Three.js-based helix with clickable, breakable links
// ============================================

class ChainHelix {
  constructor(canvasId = 'helix-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Chain Helix: Canvas with id "${canvasId}" not found. Make sure the canvas element exists in HTML.`);
      return;
    }
    
    console.log('Chain Helix: Canvas found, initializing...');

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.helixGroup = null;
    this.raycaster = null;
    this.mouse = null;
    this.hoverLink = null;
    this.clock = null;
    this.animationFrame = null;
    this.isInitialized = false;

    // Configuration
    this.config = {
      numLinks: 120,
      radius: 3.0,
      pitch: 0.15,
      angleStep: 0.35,
      rotationSpeed: 0.12,
      springStrength: 0.08,
      breakDecay: 0.88,
      breakAmount: 1.5
    };

    this.init();
  }

  async init() {
    if (!this.canvas) {
      console.warn('Chain Helix: Canvas element not found');
      return;
    }

    try {
      // Wait for Three.js to be available (it should be loaded via script tag)
      await this.waitForThreeJS();

      if (typeof THREE === 'undefined') {
        throw new Error('Three.js failed to load - make sure Three.js script is included in HTML');
      }

      console.log('Chain Helix: Three.js loaded, setting up scene...');
      this.setupScene();
      this.buildChainHelix();
      this.setupInteraction();
      this.setupResize();
      
      this.isInitialized = true;
      console.log('Chain Helix: Initialized successfully');
      this.animate();
    } catch (error) {
      console.error('Failed to initialize Chain Helix:', error);
    }
  }

  waitForThreeJS() {
    return new Promise((resolve, reject) => {
      if (typeof THREE !== 'undefined') {
        resolve();
        return;
      }

      // Listen for Three.js ready event OR check periodically
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          if (typeof THREE !== 'undefined') {
            resolve();
          } else {
            reject(new Error('Three.js did not load within timeout. Check browser console.'));
          }
        }
      }, 5000);

      const checkReady = () => {
        if (!resolved && typeof THREE !== 'undefined') {
          resolved = true;
          clearTimeout(timeout);
          resolve();
        }
      };

      window.addEventListener('threejs-ready', checkReady, { once: true });
      
      // Also check periodically in case event fires before listener is attached
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        checkReady();
        
        if (resolved || attempts >= 100) {
          clearInterval(checkInterval);
        }
      }, 50);
    });
  }

  setupScene() {
    // Scene - transparent background so content shows through
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 9);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true // Enable transparency
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0); // Clear with transparent background

    // Lights - Enhanced lighting for better visuals
    const ambient = new THREE.AmbientLight(0x1a1a2e, 1.5);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 10);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 1.2);
    rimLight.position.set(-6, -4, -5);
    this.scene.add(rimLight);

    const accentLight = new THREE.PointLight(0x6366f1, 0.8, 20);
    accentLight.position.set(0, 5, 5);
    this.scene.add(accentLight);

    // Clock for animation
    this.clock = new THREE.Clock();

    // Helix group
    this.helixGroup = new THREE.Group();
    this.scene.add(this.helixGroup);
  }

  buildChainHelix() {
    if (!this.helixGroup) return;

    const linkGeometry = new THREE.TorusGeometry(0.35, 0.12, 24, 48);
    const { numLinks, radius, pitch, angleStep } = this.config;

    for (let i = 0; i < numLinks; i++) {
      const angle = i * angleStep;
      const y = (i - numLinks / 2) * pitch;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      const material = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        metalness: 0.9,
        roughness: 0.15,
        emissive: 0x4338ca,
        emissiveIntensity: 0.4
      });

      const link = new THREE.Mesh(linkGeometry, material);
      link.position.set(x, y, z);

      // Orient the torus so its "hole" points along the helix tangent
      const tangent = new THREE.Vector3(
        -radius * Math.sin(angle),
        pitch,
        radius * Math.cos(angle)
      ).normalize();

      const up = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, tangent);
      link.quaternion.copy(quat);

      // Store base position for spring-like motion
      link.userData.basePosition = link.position.clone();
      link.userData.breakAmount = 0.0; // 0 = intact, 1 = fully broken
      link.userData.isHovered = false;

      this.helixGroup.add(link);
    }
  }

  setupInteraction() {
    if (!this.canvas) return;

    // Raycaster for mouse interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Mouse move handler
    const onPointerMove = (event) => {
      if (!this.camera || !this.helixGroup) return;

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.updateHover();
    };

    // Click handler
    const onClick = (event) => {
      if (!this.camera || !this.helixGroup) return;

      // Recompute mouse in case click happens without move
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.helixGroup.children);

      if (intersects.length > 0) {
        const link = intersects[0].object;
        // Kick the link outward: breakAmount temporarily high
        link.userData.breakAmount = 1.0;
        link.material.color.set(0xff4b4b); // flash red-ish when "broken"
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick);

    // Store handlers for cleanup
    this._onPointerMove = onPointerMove;
    this._onClick = onClick;
  }

  triggerExplosion() {
    if (!this.helixGroup) return;

    // Break all links with random directions and amounts
    this.helixGroup.children.forEach((link, index) => {
      setTimeout(() => {
        link.userData.breakAmount = 0.8 + Math.random() * 0.8;
        link.userData.breakVelocity = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );
        link.material.color.set(Math.random() > 0.5 ? 0xff6b6b : 0xa78bfa);
      }, index * 8);
    });
  }

  updateHover() {
    if (!this.raycaster || !this.camera || !this.helixGroup) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.helixGroup.children);

    if (intersects.length > 0) {
      const newHover = intersects[0].object;

      if (this.hoverLink !== newHover) {
        // Remove previous hover
        if (this.hoverLink) {
          this.hoverLink.material.emissive.set(0x000000);
          this.hoverLink.userData.isHovered = false;
        }

        // Set new hover
        this.hoverLink = newHover;
        this.hoverLink.material.emissive.set(0x22ffcc);
        this.hoverLink.userData.isHovered = true;
      }
    } else {
      if (this.hoverLink) {
        this.hoverLink.material.emissive.set(0x000000);
        this.hoverLink.userData.isHovered = false;
        this.hoverLink = null;
      }
    }
  }

  setupResize() {
    const onResize = () => {
      if (!this.camera || !this.renderer) return;

      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', utils.debounce(onResize, 250));
    this._onResize = onResize;
  }

  animate() {
    if (!this.isInitialized) return;

    this.animationFrame = requestAnimationFrame(() => this.animate());

    if (!this.scene || !this.camera || !this.renderer || !this.helixGroup) return;

    const dt = this.clock.getDelta();

    // Slow global rotation for parallax
    const scrollRotationOffset = this.scrollRotationOffset || 0;
    this.helixGroup.rotation.y += (this.config.rotationSpeed + scrollRotationOffset) * dt;

    // Spring dynamics for each link
    this.helixGroup.children.forEach((link) => {
      const base = link.userData.basePosition;
      if (!base) return;

      if (link.userData.breakAmount > 0.001) {
        // Direction roughly away from helix center
        const radial = new THREE.Vector3(base.x, 0, base.z).normalize();
        
        // Apply velocity if it exists
        if (link.userData.breakVelocity) {
          link.position.add(link.userData.breakVelocity.clone().multiplyScalar(dt * link.userData.breakAmount));
          link.userData.breakVelocity.multiplyScalar(0.95); // damping
        }
        
        const target = base.clone().addScaledVector(
          radial,
          this.config.breakAmount * link.userData.breakAmount
        );

        link.position.lerp(target, 0.2);
        link.userData.breakAmount *= this.config.breakDecay; // decay impulse
        
        // Add rotation when breaking
        link.rotation.x += dt * link.userData.breakAmount * 2;
        link.rotation.y += dt * link.userData.breakAmount * 1.5;
      } else {
        // Relax back to base
        link.position.lerp(base, this.config.springStrength);
        // Slowly fade color back to the intact style
        link.material.color.lerp(new THREE.Color(0x6366f1), 0.05);
        // Reset rotation
        link.rotation.x *= 0.95;
        link.rotation.y *= 0.95;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    // Render is called by the main app loop, but we handle our own animation
    // This method exists for consistency with other graphics modules
  }

  resize() {
    if (!this.camera || !this.renderer) return;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  destroy() {
    // Clean up event listeners
    if (this._onPointerMove) {
      window.removeEventListener('pointermove', this._onPointerMove);
    }
    if (this._onClick) {
      window.removeEventListener('click', this._onClick);
    }
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize);
    }

    // Cancel animation frame
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    // Dispose Three.js resources
    if (this.helixGroup) {
      this.helixGroup.children.forEach((link) => {
        link.geometry.dispose();
        link.material.dispose();
      });
      this.helixGroup.clear();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    this.isInitialized = false;
  }
}

