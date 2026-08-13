const CACHE_NAME = 'camino-companion-v8';
const TILE_CACHE = 'camino-tiles-v1';

// App Shell básico obligatorio
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg'
];

// 1. Instalación y Precarga
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precachando App Shell base');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Activación y Purga de Cachés Antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== TILE_CACHE) {
            console.log('[SW] Eliminando caché antigua:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Helper: Fetch con Timeout para evitar bloqueos en cobertura 2G/degradada
const fetchWithTimeout = (request, timeoutMs = 2000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Network Timeout')), timeoutMs);
    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

// 3. Intercepción Inteligente de Red
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar peticiones de extensiones o protocolos no soportados por caché
  if (!url.protocol.startsWith('http')) return;

  // A. Tiles del mapa: Cache First con fallback
  if (url.host.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          return cachedResponse || new Response('', { status: 404 });
        }
      })
    );
    return;
  }

  // B. Assets estáticos compilados por Vite (/assets/*.js, *.css, *.json, imágen/svg)
  // Estrategia: Cache First, Network Backup (Garantiza los JSONs y bundle JS en offline)
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webp')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          // Actualización silenciosa en background si hay red
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(event.request, networkResponse);
              }
            })
            .catch(() => {/* Silenciar error si está offline */});

          return cachedResponse;
        }

        // Si no está en caché, ir a la red y guardar
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return new Response('Asset no disponible offline', { status: 404 });
        }
      })
    );
    return;
  }

  // C. Navegación principal (HTML SPA): Stale-While-Revalidate con Timeout rápido
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      try {
        const networkPromise = fetchWithTimeout(event.request, 1500).then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        if (cachedResponse) {
          return networkPromise.catch(() => cachedResponse);
        }

        return await networkPromise;
      } catch (error) {
        if (cachedResponse) return cachedResponse;

        // Fallback final a index.html para Single Page App (SPA)
        if (event.request.mode === 'navigate') {
          const fallback = await cache.match('/index.html');
          if (fallback) return fallback;
        }

        return new Response('Sin conexión offline disponible', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    })
  );
});