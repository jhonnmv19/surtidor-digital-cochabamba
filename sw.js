const CACHE_NAME = 'surtidor-pwa-v1';

// Lista de assets locales que la PWA guardará en caché
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/output.css',
  './css/input.css',
  './config/supabase.js',
  
  // Controladores y Modelos
  './controllers/mainController.js',
  './controllers/authController.js',
  './controllers/alertaController.js',
  './controllers/surtidorController.js',
  './controllers/tanqueController.js',
  './controllers/ventaController.js',
  './models/authModel.js',
  './models/alertaModel.js',
  './models/surtidorModel.js',
  './models/tanqueModel.js',
  './models/ventaModel.js',
  './models/reporteModel.js',
  
  // Vistas y Componentes
  './views/dashboardView.js',
  './views/surtidoresView.js',
  './views/tanquesView.js',
  './views/ventasView.js',
  './views/reportesView.js',
  './views/componentes/navbar.js',
  './views/componentes/sidebar.js',
  
  // Imágenes e Íconos
  './imagen/yautja1.png',
  './imagen/yautja2.png',
  './imagen/daboarh.png',
  './imagen/captabla.png',
  './imagen/creacion_de_tablas.png'
];

// Instalación: Guarda todos los archivos iniciales en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Guardando archivos en caché');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación: Limpia cachés antiguas si cambias la versión (v2, v3, etc.)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Borrando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de respuesta: Busca en caché primero; si no está, va a la red
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});