import player from './modules/audio/player.js';
import { neboysyaAlbum } from './modules/data/neboysyaData.js';
import { etologiaAlbum } from './modules/data/etologiaData.js';
import { adu1Album } from './modules/data/adu1Data.js';
import { adu2Album } from './modules/data/adu2Data.js';
import { generalInfo } from './modules/data/generalinfo.js';
import { content } from './modules/data/bilingual.js';
import { debug } from './modules/utils/debug.js';
import { initLanguageSelector } from './modules/utils/language.js';
import { safeGtagEvent, safeGtagReportConversionContent, safeGtagReportConversionExt } from './modules/utils/analytics.js';
import { refreshContent } from './modules/utils/refreshContent.js';
import { populateHead, populateHeroLogo, populateTextBlocks, populateSlider, initSlider, populateFooter, populateNavButtons, populateAlbum } from './modules/content/contentPopulator.js';
import { populateFAQ } from './modules/content/faqPopulator.js';
import { initBurgerMenu, initScrollTo } from './modules/ui/navigation.js';
import { initTabFunctionality } from './modules/ui/tabFunctionality.js';
import { initStructuredData } from './modules/utils/structuredDataLoader.js';
import { initAnalytics } from './modules/utils/analyticsLoader.js';
import { initAISearchOptimization } from './modules/utils/aiSearchOptimizer.js';

// Make analytics functions globally available for inline event handlers
window.safeGtagEvent = safeGtagEvent;
window.safeGtagReportConversionContent = safeGtagReportConversionContent;
window.safeGtagReportConversionExt = safeGtagReportConversionExt;

// Initialize analytics early (for Google Analytics, Search Console, Yandex)
initAnalytics();

// Initialization logs
debug('init', 'main.js loaded');
debug('data', 'generalInfo loaded', generalInfo);
debug('data', 'neboysyaAlbum loaded', neboysyaAlbum);
debug('data', 'etologiaAlbum loaded', etologiaAlbum);
debug('data', 'adu1Album loaded', adu1Album);
debug('data', 'adu2Album loaded', adu2Album);

// Initialize structured data (loads early for SEO)
initStructuredData();

// Initialize AI search optimization
initAISearchOptimization();

// Initialize language selector
initLanguageSelector();

// Define a global function to refresh content on language switch
window.refreshContent = async function() {
  await refreshContent(generalInfo, neboysyaAlbum, etologiaAlbum, adu1Album, adu2Album, player);
};

// Starting dynamic population
debug('init', 'Starting dynamic population...');

// Populate head with metadata
populateHead(generalInfo);

// Populate hero logo
populateHeroLogo(generalInfo);

// Populate text blocks
populateTextBlocks(generalInfo);

// Populate slider
populateSlider(generalInfo);

// Initialize slider
initSlider();

// Populate footer
populateFooter(generalInfo);

// Populate navigation buttons
populateNavButtons(content);

// Populate FAQ section
populateFAQ();

// Populate album sections
debug('init', 'Starting album population...');

// Populate ADU1 album
populateAlbum('adu1', adu1Album);

// Populate ADU2 album
populateAlbum('adu2', adu2Album);

// Populate Neboysya album
populateAlbum('neboysya', neboysyaAlbum);

// Populate Etologia album
populateAlbum('etologia', etologiaAlbum);

// Initialize tab functionality
initTabFunctionality();

// Initialize burger menu
initBurgerMenu();

// Initialize scroll-to functionality
initScrollTo();

// Initialize audio player after all dynamic content is in the DOM
try {
  debug('init', 'All dynamic content added, now initializing player...');
  player();
  debug('init', 'Player initialized');
} catch (e) {
  debugError('init', 'Error initializing player:', e);
}

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