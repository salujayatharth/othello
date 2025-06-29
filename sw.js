// Service Worker for Othello PWA
const CACHE_NAME = 'othello-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './main.js',
  './AudioManager.js',
  './style.css',
  './favicon.ico',
  './drop.mp3',
  './manifest.json',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('SW: Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching app resources');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('SW: Error caching resources:', error);
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('SW: Activating service worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('SW: Serving from cache:', event.request.url);
          return response;
        }

        console.log('SW: Fetching from network:', event.request.url);
        return fetch(event.request).then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              // Only cache same-origin requests and specific external resources
              if (event.request.url.startsWith(self.location.origin) || 
                  event.request.url.includes('tailwindcss.com') ||
                  event.request.url.includes('googleapis.com')) {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        });
      })
      .catch(() => {
        // If both cache and network fail, provide a fallback
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

// Listen for messages from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});