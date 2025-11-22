// ============================================
// TRACK CLASS (Scroll Progress 0-1)
// Returns normalized scroll value for element
// ============================================

class Track extends Observer {
  constructor({ element, config = {} }) {
    super({ element, config });
    this.value = 0;
    this.bounds = { top: 0, bottom: 0, height: 0 };
    this.calculateBounds();

    window.addEventListener('resize', utils.debounce(() => {
      this.calculateBounds();
    }, 250));
  }

  calculateBounds() {
    const rect = this.element.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;

    this.bounds.top = rect.top + scrollY;
    this.bounds.bottom = this.bounds.top + rect.height;
    this.bounds.height = rect.height;
  }

  update() {
    if (!this.isInView) return 0;

    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;

    // Start when bottom of element enters viewport
    // End when top of element exits viewport
    const start = this.bounds.top - windowHeight;
    const end = this.bounds.bottom;
    const distance = end - start;

    if (distance <= 0) {
      this.value = 0;
      return this.value;
    }

    const progress = (scrollY - start) / distance;
    this.value = utils.clamp(progress, 0, 1);

    return this.value;
  }
}

