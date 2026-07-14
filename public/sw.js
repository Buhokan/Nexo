// Service Worker de Nexo — PWA
const CACHE_NAME = "nexo-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Solo cachear GET requests, pasar todo lo demás normal
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request));
});
