// ============================================
// IMAGE REVEAL WITH CLIP-PATH
// The signature scroll-reveal effect
// ============================================

class ImageReveal {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.image = wrapper.querySelector('.project-inner') || wrapper.querySelector('.image-inner');
    if (!this.image) {
      const img = wrapper.querySelector('img');
      if (img) {
        this.image = img.parentElement || img;
      }
    }
    
    this.track = new Track({ element: wrapper });

    // Initial state
    if (this.wrapper) {
      this.wrapper.style.clipPath = 'inset(100% 0 0 0)';
    }
    if (this.image) {
      this.image.style.transform = 'scale(1.2)';
    }

    // Mark wrapper for styling
    this.wrapper.classList.add('project-wrapper');
  }

  render() {
    if (!this.track.isInView) return;

    this.track.update();
    const v = this.track.value;

    // Clip-path reveal (adjust values for different effects)
    // Reveal from center (top and bottom simultaneously)
    const centerStart = 0.3;
    const centerEnd = 0.7;

    let topInset, bottomInset;

    if (v < centerStart) {
      topInset = 100;
      bottomInset = 100;
    } else if (v < centerEnd) {
      const localProgress = (v - centerStart) / (centerEnd - centerStart);
      topInset = 100 - (localProgress * 100);
      bottomInset = 100 - (localProgress * 100);
    } else {
      topInset = 0;
      bottomInset = 0;
    }

    if (this.wrapper) {
      this.wrapper.style.clipPath = `inset(${topInset}% 0 ${bottomInset}% 0)`;
    }

    // Counter-scale effect (image zooms out as it reveals)
    if (this.image) {
      const scale = 1.2 - (v * 0.2);
      this.image.style.transform = `scale(${Math.max(1, scale)})`;
    }

    // Add in-view class when visible
    if (v > 0.1 && !this.wrapper.parentElement.classList.contains('in-view')) {
      this.wrapper.parentElement.classList.add('in-view');
    }
  }
}

