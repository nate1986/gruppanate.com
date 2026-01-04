import { aboutData } from './modules/data/aboutData.js';
import { generalInfo } from './modules/data/generalinfo.js';
import { debug, debugError } from './modules/utils/debug.js';
import { initLanguageSelector, translate, getCurrentLanguage } from './modules/utils/language.js';
import { safeGtagEvent, safeGtagReportConversionContent, safeGtagReportConversionExt } from './modules/utils/analytics.js';
import { populateHead, populateHeroLogo, populateFooter, populateAbout } from './modules/content/contentPopulator.js';
import { initStructuredData } from './modules/utils/structuredDataLoader.js';
import { initAnalytics } from './modules/utils/analyticsLoader.js';
import player from './modules/audio/player.js';

// Make analytics functions globally available for inline event handlers
window.safeGtagEvent = safeGtagEvent;
window.safeGtagReportConversionContent = safeGtagReportConversionContent;
window.safeGtagReportConversionExt = safeGtagReportConversionExt;

// Initialize analytics early (for Google Analytics, Search Console, Yandex)
initAnalytics();

// Initialization logs
debug('init', 'about.js loaded');
debug('data', 'aboutData loaded', aboutData);
debug('data', 'generalInfo loaded', generalInfo);

// Initialize structured data (loads early for SEO)
initStructuredData();

// Initialize language selector
initLanguageSelector();

// Starting dynamic population
debug('init', 'Starting dynamic population...');

// Populate head with metadata from aboutData
const aboutHeadData = {
  head: {
    title: aboutData.head.title,
    meta: aboutData.head.meta,
    favicon: generalInfo.head.favicon,
    styles: generalInfo.head.styles,
    googleTag: generalInfo.head.googleTag,
    yandexMetrika: generalInfo.head.yandexMetrika,
    yandexNoscript: generalInfo.head.yandexNoscript
  }
};
populateHead(aboutHeadData);

// Populate hero logo
const aboutHeroData = {
  logo: aboutData.logo
};
populateHeroLogo(aboutHeroData);

// Populate about page content
populateAbout(aboutData);

// Populate footer
populateFooter(generalInfo);

// Initialize audio player after all dynamic content is in the DOM
try {
  debug('init', 'All dynamic content added, now initializing player...');
  player();
  debug('init', 'Player initialized');
} catch (e) {
  debugError('init', 'Error initializing player:', e);
}

// Define a global function to refresh content on language switch
window.refreshContent = async function() {
  await refreshAboutContent(aboutData, generalInfo, player);
};

// Register Service Worker for caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[Service Worker] Registered successfully:', registration.scope);
        debug('init', 'Service Worker registered');
      })
      .catch((error) => {
        console.error('[Service Worker] Registration failed:', error);
        debugError('init', 'Service Worker registration failed:', error);
      });
  });
}

/**
 * Refreshes about page content when language is switched
 * @param {Object} aboutData - About page data
 * @param {Object} generalInfo - General site information
 * @param {Function} playerInit - Function to initialize player
 */
async function refreshAboutContent(aboutData, generalInfo, playerInit) {
  debug('init', 'Refreshing about page content for language update');
  
  // Stop all audio playback before refreshing content
  try {
    const allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
        debug('init', 'Paused audio during language switch');
      }
    });
    
    document.querySelectorAll('.play-button.playing').forEach(button => {
      button.classList.remove('playing');
    });
    
    document.querySelectorAll('.audio-controls-bar-current').forEach(bar => {
      bar.style.width = '0%';
    });
    
    document.querySelectorAll('.audio-controls-time').forEach(time => {
      time.textContent = '0:00';
    });
    
    const cleanupEvent = new CustomEvent('audioCleanupRequired');
    window.dispatchEvent(cleanupEvent);
    debug('init', 'Dispatched audio cleanup event during language switch');
  } catch (e) {
    debugError('init', 'Error stopping audio during language switch:', e);
  }
  
  // Re-populate head
  try {
    document.getElementById('site-title').innerText = translate(aboutData.head.title);
    document.getElementById('meta-description').content = translate(aboutData.head.meta.description);
    document.getElementById('meta-keywords').content = translate(aboutData.head.meta.keywords);
    debug('init', 'Head metadata refreshed');
  } catch (e) {
    debugError('init', 'Error refreshing head metadata:', e);
  }
  
  // Re-populate hero logo
  try {
    const heroLogo = document.getElementById('hero-logo');
    if (heroLogo) {
      const lang = getCurrentLanguage();
      const svgPath = translate(aboutData.logo);
      fetch(svgPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(svgText => {
          heroLogo.innerHTML = svgText;
          debug('init', 'Hero logo SVG refreshed');
        })
        .catch(error => debugError('init', `Error loading Hero logo SVG for ${lang} from ${svgPath}:`, error));
    }
  } catch (e) {
    debugError('init', 'Error refreshing hero logo:', e);
  }
  
  // Re-populate about page content
  populateAbout(aboutData);
  
  // Re-populate footer
  populateFooter(generalInfo);
  
  // Re-initialize audio player after content refresh
  try {
    debug('init', 'Re-initializing audio player after language switch');
    playerInit();
    debug('init', 'Audio player re-initialized successfully');
  } catch (e) {
    debugError('init', 'Error re-initializing audio player after language switch:', e);
  }
}

