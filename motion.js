/* ============================================
   MOTION.JS — Lightweight motion enhancements
   ============================================ */

(function() {
  'use strict';

  // ==========================================
  // 1. FIX: Above-fold elements visible on load
  // Immediately reveal any js-reveal or stagger
  // elements that are already in the viewport
  // ==========================================
  function revealAboveFold() {
    const reveals = document.querySelectorAll('.js-reveal, .stagger');
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  }
  
  // Run immediately and after a short delay for safety
  revealAboveFold();
  requestAnimationFrame(revealAboveFold);

  // ==========================================
  // 2. Card hover glow (cursor tracking)
  // ==========================================
  function initCardGlow() {
    const cards = document.querySelectorAll('.card, .pricing-card, .pricing-card-full, .testimonial, .value-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  // ==========================================
  // 3. Number counter animation
  // Animates price numbers when scrolled into view
  // ==========================================
  function animateCounter(el, targetNum, prefix, suffix, duration) {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    
    const startTime = performance.now();
    const startNum = 0;
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startNum + (targetNum - startNum) * eased);
      
      el.textContent = prefix + current.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + targetNum.toLocaleString() + suffix;
      }
    }
    
    requestAnimationFrame(update);
  }

  function initCounters() {
    // Find price amounts that should be animated
    const counterEls = document.querySelectorAll('[data-counter]');
    
    if (counterEls.length === 0) return;
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.counter, 10);
          const prefix = el.dataset.counterPrefix || '';
          const suffix = el.dataset.counterSuffix || '';
          const duration = parseInt(el.dataset.counterDuration || '800', 10);
          
          // Small delay for visual effect
          setTimeout(() => {
            animateCounter(el, target, prefix, suffix, duration);
          }, 100);
          
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    
    counterEls.forEach(el => counterObserver.observe(el));
  }

  // ==========================================
  // 4. Smooth scroll for internal links
  // ==========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ==========================================
  // Initialize when DOM is ready
  // ==========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initCardGlow();
    initCounters();
    initSmoothScroll();
  }
})();
