import { debug, debugError } from '../utils/debug.js';

/**
 * Initialize burger menu functionality
 */
export function initBurgerMenu() {
  try {
    let burgerBtn = document.querySelector('.mobile-btn');
    
    if (burgerBtn) {
      burgerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const mobileMenu = burgerBtn.closest('.mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.toggle('active');
          debug('init', 'Mobile menu toggled');
        }
      });
      debug('init', 'Mobile burger menu initialized');
    } else {
      debugError('init', 'Mobile burger button not found');
    }
  } catch (e) {
    debugError('init', 'Error initializing burger menu:', e);
  }
}

/**
 * Initialize scroll-to functionality
 */
export function initScrollTo() {
  // Current album section
  $(".hero-buttons-wrapper .btn:first-child").click(function () {
    $([document.documentElement, document.body]).animate({
      scrollTop: $(".album").offset().top
    }, 2000);
  });

  // Archive section
  $(".hero-buttons-wrapper .btn:nth-child(2)").click(function () {
    $([document.documentElement, document.body]).animate({
      scrollTop: $(".slider").offset().top
    }, 2000);
  });

  // Remasters section
  $(".hero-buttons-wrapper .btn:nth-child(3)").click(function () {
    $([document.documentElement, document.body]).animate({
      scrollTop: $(".playlist").offset().top
    }, 2000);
  });
  
  debug('init', 'Scroll-to functionality initialized');
}
