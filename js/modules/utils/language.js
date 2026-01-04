import { debug, debugError } from './debug.js';

/**
 * Get the current language from URL parameter
 * @returns {string} - Language code ('ru' or 'en')
 */
export function getCurrentLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang');
  
  // Default to Russian if no parameter or invalid value
  if (lang === 'en') {
    return 'en';
  }
  return 'ru';
}

/**
 * Set the current language by updating URL parameter
 * @param {string} lang - Language code ('ru' or 'en')
 */
export function setLanguage(lang) {
  const url = new URL(window.location.href);
  
  if (lang === 'ru') {
    // Remove lang parameter for Russian (default)
    url.searchParams.delete('lang');
  } else {
    url.searchParams.set('lang', lang);
  }
  
  debug('ui', `Switching language to: ${lang}`);
  // Update the URL without reloading the page
  window.history.pushState({}, '', url.toString());
  updateTranslatedContent(); // Call updateTranslatedContent after changing language
}

/**
 * Get translated content based on current language
 * @param {Object} translations - Object with 'ru' and 'en' properties
 * @returns {*} - Translated content
 */
export function translate(translations) {
  const lang = getCurrentLanguage();
  return translations[lang] || translations.ru;
}

// Define the event handler function outside initLanguageSelector
function handleLanguageButtonClick(e) {
  e.preventDefault();
  const currentLang = getCurrentLanguage(); // Get current language inside handler
  const newLang = currentLang === 'ru' ? 'en' : 'ru';
  setLanguage(newLang);
}

/**
 * Initialize language selector
 */
export function initLanguageSelector() {
  const currentLang = getCurrentLanguage();
  debug('init', `Current language: ${currentLang}`);
  
  // Update HTML lang attribute
  document.documentElement.lang = currentLang;
  
  // Update language button
  const langButton = document.querySelector('.lang-button');
  if (langButton) {
    const langText = langButton.querySelector('span');
    if (langText) {
      langText.textContent = currentLang === 'ru' ? 'EN' : 'RU';
    }
    
    // Remove existing event listener to prevent duplicates
    langButton.removeEventListener('click', handleLanguageButtonClick);
    
    // Add the new event listener
    langButton.addEventListener('click', handleLanguageButtonClick);
  }
}

/**
 * Dynamically update all translated content on the page.
 * This function should be called after translations are loaded or language is switched.
 */
export function updateTranslatedContent() {
  // Update HTML lang attribute
  const currentLang = getCurrentLanguage();
  document.documentElement.lang = currentLang;
  
  // Update language button text
  const langButton = document.querySelector('.lang-button');
  if (langButton) {
    const langText = langButton.querySelector('span');
    if (langText) {
      langText.textContent = currentLang === 'ru' ? 'EN' : 'RU';
      debug('ui', `Language button updated to: ${langText.textContent}`);
    }
  }
  
  // Re-trigger content population to apply translations without reloading the page
  if (typeof window.refreshContent === 'function') {
    window.refreshContent();
  } else {
    debugError('ui', 'refreshContent function not found');
  }
}


