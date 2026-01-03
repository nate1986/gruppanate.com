// Debug Mode Configuration
// Set to true to enable debug logging, false to disable
const DEBUG_MODE = true;

// Debug categories - can selectively enable/disable different types of logs
const DEBUG_CATEGORIES = {
  audio: DEBUG_MODE,
  player: DEBUG_MODE,
  ui: DEBUG_MODE,
  data: DEBUG_MODE,
  init: DEBUG_MODE,
  timeline: DEBUG_MODE,
  seek: DEBUG_MODE,
  general: DEBUG_MODE
};

/**
 * Debug logger with category support
 * @param {string} category - Category of the log (audio, player, ui, etc.)
 * @param {string} message - Main log message
 * @param {*} data - Optional data to log
 */
export function debug(category, message, data = null) {
  if (!DEBUG_CATEGORIES[category]) return;
  
  const timestamp = new Date().toISOString().substr(11, 12);
  const prefix = `[${timestamp}][${category.toUpperCase()}]`;
  
  if (data !== null) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

/**
 * Debug warning logger
 * @param {string} category - Category of the warning
 * @param {string} message - Warning message
 * @param {*} data - Optional data to log
 */
export function debugWarn(category, message, data = null) {
  if (!DEBUG_CATEGORIES[category]) return;
  
  const timestamp = new Date().toISOString().substr(11, 12);
  const prefix = `[${timestamp}][${category.toUpperCase()}][WARN]`;
  
  if (data !== null) {
    console.warn(`${prefix} ${message}`, data);
  } else {
    console.warn(`${prefix} ${message}`);
  }
}

/**
 * Debug error logger (always shows, even when DEBUG_MODE is off)
 * @param {string} category - Category of the error
 * @param {string} message - Error message
 * @param {*} error - Error object or data
 */
export function debugError(category, message, error = null) {
  const timestamp = new Date().toISOString().substr(11, 12);
  const prefix = `[${timestamp}][${category.toUpperCase()}][ERROR]`;
  
  if (error !== null) {
    console.error(`${prefix} ${message}`, error);
  } else {
    console.error(`${prefix} ${message}`);
  }
}

/**
 * Performance measurement helper
 * @param {string} label - Label for the measurement
 * @returns {Function} End function to call when measurement is complete
 */
export function debugPerf(category, label) {
  if (!DEBUG_CATEGORIES[category]) return () => {};
  
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    debug(category, `⏱️ ${label}: ${duration.toFixed(2)}ms`);
  };
}

/**
 * Group logging for related operations
 * @param {string} category - Category of the group
 * @param {string} title - Group title
 * @param {Function} callback - Function to execute within the group
 */
export function debugGroup(category, title, callback) {
  if (!DEBUG_CATEGORIES[category]) {
    callback();
    return;
  }
  
  console.group(`[${category.toUpperCase()}] ${title}`);
  callback();
  console.groupEnd();
}

// Export debug mode status for conditional logic
export const isDebugMode = () => DEBUG_MODE;
export const isDebugCategory = (category) => DEBUG_CATEGORIES[category] || false;


