var cacheName = "courseStore-v1";

var cacheFiles = [
"courseShop.html",
"vueInstance.js",
"icon.png",
];
self.addEventListener("install", function(e) {
console.log("[Service Worker] Install");
e.waitUntil(
caches.open(cacheName).then(function(cache) {
console.log("[Service Worker] Caching files");
return cache.addAll(cacheFiles);
})
);
});