/**
 * Analytics Loader
 * ================
 * 
 * Loads Google Analytics, Google Search Console verification,
 * Yandex Metrika, and other analytics/verification scripts
 * from the centralized SEO config.
 * 
 * This makes it easy for managers to update analytics IDs
 * in one place (seoConfig.js)
 */

import { seoConfig } from '../data/seoConfig.js';
import { debug, debugError } from './debug.js';

/**
 * Load Google Analytics (GA4)
 */
export function loadGoogleAnalytics() {
  try {
    // Check if already loaded
    if (window.dataLayer && window.gtag) {
      debug('analytics', 'Google Analytics already loaded');
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${seoConfig.google.analyticsId}`;
    document.head.appendChild(script);

    // Configure GA4
    gtag('config', seoConfig.google.analyticsId);

    // Configure Google Ads if ID is provided
    if (seoConfig.google.adsId) {
      gtag('config', seoConfig.google.adsId);
    }

    debug('analytics', 'Google Analytics loaded:', seoConfig.google.analyticsId);
  } catch (error) {
    debugError('analytics', 'Error loading Google Analytics:', error);
  }
}

/**
 * Load Google Ads conversion tracking functions
 */
export function loadGoogleAdsConversions() {
  try {
    if (!seoConfig.google.adsId || !seoConfig.google.conversionLabels) {
      return;
    }

    // Content conversion function
    window.gtag_report_conversion_content = function(url) {
      const callback = function() {
        if (typeof url !== 'undefined') {
          window.location = url;
        }
      };
      window.gtag('event', 'conversion', {
        'send_to': `${seoConfig.google.adsId}/${seoConfig.google.conversionLabels.content}`,
        'event_callback': callback
      });
      return false;
    };

    // External link conversion function
    window.gtag_report_conversion_ext = function(url) {
      const callback = function() {
        if (typeof url !== 'undefined') {
          window.location = url;
        }
      };
      window.gtag('event', 'conversion', {
        'send_to': `${seoConfig.google.adsId}/${seoConfig.google.conversionLabels.external}`,
        'event_callback': callback
      });
      return false;
    };

    debug('analytics', 'Google Ads conversion functions loaded');
  } catch (error) {
    debugError('analytics', 'Error loading Google Ads conversions:', error);
  }
}

/**
 * Add Google Search Console verification meta tag
 */
export function addGoogleSearchConsoleVerification() {
  try {
    if (!seoConfig.google.searchConsoleVerification) {
      debug('analytics', 'Google Search Console verification not configured');
      return;
    }

    // Check if already exists
    const existing = document.querySelector('meta[name="google-site-verification"]');
    if (existing) {
      debug('analytics', 'Google Search Console verification already exists');
      return;
    }

    const meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = seoConfig.google.searchConsoleVerification;
    document.head.appendChild(meta);

    debug('analytics', 'Google Search Console verification added');
  } catch (error) {
    debugError('analytics', 'Error adding Google Search Console verification:', error);
  }
}

/**
 * Load Yandex Metrika
 */
export function loadYandexMetrika() {
  try {
    if (!seoConfig.yandex.metrikaId) {
      debug('analytics', 'Yandex Metrika ID not configured');
      return;
    }

    // Check if already loaded
    if (window.ym) {
      debug('analytics', 'Yandex Metrika already loaded');
      return;
    }

    // Yandex Metrika script
    const script = `
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) { return; }
        }
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      ym(${seoConfig.yandex.metrikaId}, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      });
    `;

    const scriptElement = document.createElement('script');
    scriptElement.innerHTML = script;
    document.head.appendChild(scriptElement);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${seoConfig.yandex.metrikaId}" style="position:absolute; left:-9999px;" alt="" /></div>`;
    document.body.appendChild(noscript);

    debug('analytics', 'Yandex Metrika loaded:', seoConfig.yandex.metrikaId);
  } catch (error) {
    debugError('analytics', 'Error loading Yandex Metrika:', error);
  }
}

/**
 * Add Yandex Webmaster verification meta tag
 */
export function addYandexWebmasterVerification() {
  try {
    if (!seoConfig.yandex.webmasterVerification) {
      debug('analytics', 'Yandex Webmaster verification not configured');
      return;
    }

    // Check if already exists
    const existing = document.querySelector('meta[name="yandex-verification"]');
    if (existing) {
      debug('analytics', 'Yandex Webmaster verification already exists');
      return;
    }

    const meta = document.createElement('meta');
    meta.name = 'yandex-verification';
    meta.content = seoConfig.yandex.webmasterVerification;
    document.head.appendChild(meta);

    debug('analytics', 'Yandex Webmaster verification added');
  } catch (error) {
    debugError('analytics', 'Error adding Yandex Webmaster verification:', error);
  }
}

/**
 * Initialize all analytics and verification scripts
 * Call this early in page load (in head or early in body)
 */
export function initAnalytics() {
  // Load Google Analytics first (most important)
  loadGoogleAnalytics();
  
  // Load Google Ads conversions
  loadGoogleAdsConversions();
  
  // Add Google Search Console verification
  addGoogleSearchConsoleVerification();
  
  // Load Yandex Metrika
  loadYandexMetrika();
  
  // Add Yandex Webmaster verification
  addYandexWebmasterVerification();
  
  debug('analytics', 'All analytics initialized');
}


