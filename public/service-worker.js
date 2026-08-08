// Bump this version whenever you deploy to force cache refresh
const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `myairy-${CACHE_VERSION}`;

// Static assets that can be cached long-term
const STATIC_CACHE = [
  '/logo.png',
  '/favicon.png',
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap',
  'https://fonts.googleapis.com/css2?family=Italianno&family=Passero+One&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Critical app files that should always be fresh (network-first)
const NETWORK_FIRST = [
  '/app.js',
  '/style.css',
  '/index.html',
  '/'
];

// Install event - cache static resources only
self.addEventListener('install', (event) => {
  console.log('[SW] Installing new service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches aggressively
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
    .then(() => {
      console.log('[SW] Service worker activated and claimed clients');
      // Force all clients to reload to get fresh content
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => client.navigate(client.url));
      });
    })
  );
});

// Fetch event - network-first for app files, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip API calls
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // Network-first strategy for critical app files
  const shouldUseNetworkFirst = NETWORK_FIRST.some(path => 
    url.pathname === path || url.pathname.endsWith(path)
  );
  
  if (shouldUseNetworkFirst) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache the fresh response
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache as fallback
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              console.log('[SW] Serving stale cache for:', url.pathname);
              return cachedResponse;
            }
            // If document request fails completely, serve cached index
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            throw new Error('Network failed and no cache available');
          });
        })
    );
  } else {
    // Cache-first for static assets (images, fonts, etc.)
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          });
        })
    );
  }
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
