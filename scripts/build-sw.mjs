// Build-time service worker generator: inlines hashed dist assets into sw.js.
// Run after `vite build`; keeps the worker hand-written with zero runtime deps.
import { readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dist = new URL('../dist/', import.meta.url).pathname
const assets = readdirSync(join(dist, 'assets')).filter((file) =>
  /\.(js|css|woff2?)$/.test(file)
)

const shell = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  ...assets.map((file) => `/assets/${file}`),
]

const worker = `const VERSION = ${JSON.stringify(`qrengine-${Date.now()}`)};
const SHELL = ${JSON.stringify(shell, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')));
    return;
  }
  event.respondWith(
    caches.match(request).then((hit) => {
      const miss = fetch(request).then((res) => {
        if (res.ok) caches.open(VERSION).then((cache) => cache.put(request, res.clone()));
        return res;
      });
      return hit || miss;
    })
  );
});
`

writeFileSync(join(dist, 'sw.js'), worker)
console.log(`sw.js written with ${shell.length} precached files`)
