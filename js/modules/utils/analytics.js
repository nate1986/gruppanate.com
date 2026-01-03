import { debugWarn } from './debug.js';

/**
 * Helper function for safe gtag event calls
 * @param  {...any} args - Arguments to pass to gtag
 */
export function safeGtagEvent(...args) {
  if (typeof gtag === 'function') {
    gtag(...args);
  } else {
    debugWarn('gtag', 'gtag not defined, event not sent:', args);
  }
}

/**
 * Helper function for safe gtag report conversion content calls
 * @param {string} url - URL to report conversion for
 */
export function safeGtagReportConversionContent(url) {
  if (typeof gtag_report_conversion_content === 'function') {
    gtag_report_conversion_content(url);
  } else {
    debugWarn('gtag', 'gtag_report_conversion_content not defined, conversion not reported');
  }
}

/**
 * Helper function for safe gtag report conversion external calls
 * @param {string} url - URL to report conversion for
 */
export function safeGtagReportConversionExt(url) {
  if (typeof gtag_report_conversion_ext === 'function') {
    gtag_report_conversion_ext(url);
  } else {
    debugWarn('gtag', 'gtag_report_conversion_ext not defined, conversion not reported');
  }
}
