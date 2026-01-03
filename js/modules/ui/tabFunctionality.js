import { debug } from '../utils/debug.js';

/**
 * Binds tab functionality to tab items
 */
export function bindTabFunctionality() {
  $(".tab-item").off('click').click(function () {
    $(this).closest(".voice-assistant-item").toggleClass('active').find(".tab-content").slideToggle();
    $(this).closest(".voice-assistant-item").prevAll(".voice-assistant-item").removeClass('active')
      .find(".tab-content").slideUp();
    $(this).closest(".voice-assistant-item").nextAll(".voice-assistant-item").removeClass('active')
      .find(".tab-content").slideUp();
  });
  debug('init', 'Tab functionality bound');
}

/**
 * Initialize tab functionality on document ready
 */
export function initTabFunctionality() {
  $(document).ready(function () {
    bindTabFunctionality();
    debug('init', 'Tab functionality initialized');
  });
}
