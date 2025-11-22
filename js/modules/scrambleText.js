// ============================================
// SCRAMBLED TEXT EFFECT
// Animated text reveal with character scrambling
// ============================================

function scrambleText(element, options = {}) {
  if (!element) return Promise.resolve();

  const finalText = element.textContent || element.innerText || '';
  if (!finalText.trim()) return Promise.resolve();

  const {
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    duration = 1000,
    steps = 30,
    delay = 0,
  } = options;

  return new Promise((resolve) => {
    setTimeout(() => {
      const stepDuration = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        const progress = currentStep / steps;
        let scrambled = '';

        for (let i = 0; i < finalText.length; i++) {
          if (i < finalText.length * progress) {
            // Revealed characters
            scrambled += finalText[i];
          } else {
            // Scrambled characters
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        if (element) {
          element.textContent = scrambled;
        }

        currentStep++;

        if (currentStep >= steps) {
          clearInterval(interval);
          if (element) {
            element.textContent = finalText;
          }
          resolve();
        }
      }, stepDuration);
    }, delay);
  });
}

