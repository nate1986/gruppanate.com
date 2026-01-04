/**
 * Service Worker for gruppanate.com
 * Caches static resources for offline support and faster loading
 */

const CACHE_NAME = 'gruppanate-v1';
const STATIC_CACHE_NAME = 'gruppanate-static-v1';

// Resources to cache immediately on install
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/about.html',
  '/css/variables.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/css/custom.css',
  '/css/slick.css',
  '/fonts/NeueHaasUnica-Regular.woff2',
  '/fonts/NeueHaasUnica-Medium.woff2',
  '/fonts/NeueHaasUnica-Light.woff2',
  '/img/hero.webp',
  '/img/og.webp',
  '/img/favicon.ico',
  '/js/main.js',
  '/js/jquery.min.js',
  '/js/slick.min.js',
  '/robots.txt',
  '/sitemap.xml'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static resources');
      return cache.addAll(STATIC_RESOURCES.map(url => new Request(url, {cache: 'reload'})));
    }).catch((error) => {
      console.error('[Service Worker] Cache install failed:', error);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of all pages immediately
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (analytics, etc.)
  if (url.origin !== location.origin) {
    return;
  }

  // Skip service worker file itself
  if (url.pathname === '/sw.js') {
    return;
  }

  // Strategy: Cache First, then Network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version
        return cachedResponse;
      }

      // Fetch from network
      return fetch(request).then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the response
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Network failed, return offline page if available
        if (request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});

