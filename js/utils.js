// ============================================
// UTILITY FUNCTIONS
// ============================================

const utils = {
  // Linear interpolation
  lerp: (start, end, t) => start + (end - start) * t,

  // Clamp value between min and max
  clamp: (value, min, max) => Math.max(min, Math.min(max, value)),

  // Map value from one range to another
  map: (value, inMin, inMax, outMin, outMax) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  },

  // Normalize value to 0-1 range
  normalize: (value, min, max) => (value - min) / (max - min),

  // Get element bounds relative to document
  getBounds: (element) => {
    const rect = element.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;

    return {
      top: rect.top + scrollY,
      bottom: rect.bottom + scrollY,
      left: rect.left,
      right: rect.right,
      width: rect.width,
      height: rect.height,
    };
  },

  // Debounce function calls
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Check if element is in viewport
  isInViewport: (element, offset = 0) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top < window.innerHeight - offset &&
      rect.bottom > offset
    );
  },

  // Convert hex color to RGB
  hexToRgb: (hex) => {
    if (!hex) return { r: 10, g: 10, b: 10 };
    
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Handle shorthand hex (e.g., #1a2 -> #11aa22)
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    if (hex.length < 6) return { r: 10, g: 10, b: 10 };
    
    const r = parseInt(hex.slice(0, 2), 16) || 10;
    const g = parseInt(hex.slice(2, 4), 16) || 10;
    const b = parseInt(hex.slice(4, 6), 16) || 10;
    
    return { r: isNaN(r) ? 10 : r, g: isNaN(g) ? 10 : g, b: isNaN(b) ? 10 : b };
  },

  // Convert RGB to hex
  rgbToHex: (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },
};

