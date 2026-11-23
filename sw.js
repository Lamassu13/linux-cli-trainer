/* sw.js — offline support. All paths are relative to this file, so it works under /repo-name/.
 * Bump VERSION when you change files so returning visitors get the update.
 */
var VERSION = 'lcl-v8';
var ASSETS = [
  './', './index.html', './css/styles.css',
  './js/content.js', './js/terminal.js', './js/srs.js', './js/app.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  // cache: 'reload' bypasses the HTTP cache so a VERSION bump never stores stale copies
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return c.addAll(ASSETS.map(function (u) { return new Request(u, { cache: 'reload' }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Stale-while-revalidate for same-origin GETs; navigations fall back to the cached index.html.
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(function (cache) {
    return cache.match(req, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(req).then(function (res) {
        // Safari refuses redirected responses for navigations, so never cache them.
        if (res && res.ok && !res.redirected && res.type === 'basic') cache.put(req, res.clone());
        return res;
      }).catch(function () { return null; });
      if (hit) { e.waitUntil(net); return hit; }
      return net.then(function (res) {
        if (res) return res;
        if (req.mode === 'navigate') return cache.match('./index.html');
        return new Response('', { status: 504, statusText: 'Offline' });
      });
    });
  }));
});
