/* O cache guarda apenas arquivos públicos do jogo, nunca respostas dos alunos. */
const VERSION = 'guarani-caminhos-v1';
const STATIC_FILES = [
  './', './index.html', './styles.css', './favicon.svg',
  './manifest.webmanifest', './icons/icon-180.png',
  './icons/icon-192.png', './icons/icon-512.png',
  './src/app.js', './src/quiz-data.js', './src/scoring.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(STATIC_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('guarani-caminhos-') && name !== VERSION)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try { return await fetch(request); }
    catch { return caches.match('./index.html') || Response.error(); }
  })());
});
