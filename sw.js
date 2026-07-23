const CACHE_NAME = 'surtidor-pwa-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/input.css',
  '/config/supabase.js',
  
  // Controladores y Modelos
  '/controllers/mainController.js',
  '/controllers/authController.js',
  '/controllers/alertaController.js',
  '/controllers/surtidorController.js',
  '/controllers/tanqueController.js',
  '/controllers/ventaController.js',
  '/models/authModel.js',
  '/models/alertaModel.js',
  '/models/surtidorModel.js',
  '/models/tanqueModel.js',
  '/models/ventaModel.js',
  '/models/reporteModel.js',
  
  // Vistas y Componentes
  '/views/dashboardView.js',
  '/views/surtidoresView.js',
  '/views/tanquesView.js',
  '/views/ventasView.js',
  '/views/reportesView.js',
  '/views/componentes/navbar.js',
  '/views/componentes/sidebar.js',
  
  // Imágenes
  '/imagen/yautja1.png',
  '/imagen/yautja2.png',
  '/imagen/daboarh.png',
  '/imagen/captabla.png',
  '/imagen/creacion_de_tablas.png'
];

// Instalación: Agrega assets de forma segura
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Cacheando assets...');
      // Usamos Promise.allSettled para evitar que una ruta 404 rompa todo el SW
      await Promise.allSettled(
        ASSETS_TO_CACHE.map(async (url) => {
          try {
            await cache.add(url);
          } catch (err) {
            console.warn(`[SW] No se pudo cachear el recurso: ${url}`, err);
          }
        })
      );
    })
  );
  self.skipWaiting();
});

// Activación: Limpieza de cachés antiguas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetching: Estrategia de respuesta
self.addEventListener('fetch', (e) => {
  // Ignorar peticiones que no sean GET (como inserts/updates en Supabase)
  if (e.request.method !== 'GET') return;

  // Ignorar llamadas directas a Supabase u orígenes externos en la caché local
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) {
    return; // Permite que las CDNs y Supabase se manejen directamente vía red
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).catch(() => {
        // Fallback si no hay red y se busca navegación
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});