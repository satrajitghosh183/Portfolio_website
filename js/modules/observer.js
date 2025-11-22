// ============================================
// OBSERVER BASE CLASS
// Foundation for all viewport detection
// ============================================

class Observer {
  constructor({ element, config = {} }) {
    this.element = element;
    this.config = {
      root: config.root || null,
      rootMargin: config.rootMargin || '0px',
      threshold: config.threshold || 0,
    };

    this.isInView = false;
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver(
      (entries) => this.onIntersect(entries),
      this.config
    );
    this.observer.observe(this.element);
  }

  onIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.isInView = true;
        this.onEnter();
      } else {
        this.isInView = false;
        this.onLeave();
      }
    });
  }

  // Override these in subclasses
  onEnter() {}
  onLeave() {}

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

