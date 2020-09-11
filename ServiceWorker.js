// importScripts("./node_modules/workbox-sw/build/workbox-sw.js");
var cacheName = "weather-pwa-v1";
var filesToCache = [
  "/",
  "index.html",
  "styles.css",
  "app.js",
  "icons",
  "./icons/icon.png",
  "fonts/rimouski_sb-webfont.woff2",
  "fonts/rimouski_sb-webfont.woff",
];
// if (workbox) {
//   console.log("workbox is working");
// }
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  caches.keys().then((keyList) => {
    return Promise.all(
      keyList.map((key) => {
        if (key !== cacheName) {
          console.log("Serviceworker = removing al cache", key);
          return caches.delete(key);
        }
      })
    );
  });
});
self.addEventListener("fetch", (e) => {
  const request = e.request;
  console.log("fetch event", e);

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
