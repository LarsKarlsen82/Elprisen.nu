const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const maxCacheSize = 50; // Maximum number of items to keep in the cache

const assets = [
    '/',
    './index.html',
    './historik.html',
    './oversigt.html',
    './settings.html',
    './desktop.html',
    './assets/css/style.css',
    './assets/css/desktop.css',
    'https://kit.fontawesome.com/7631ec8517.js',
    './assets/js/script.js',
    './assets/js/desktop.js',
    './assets/images',
    './fallback.html'
];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll(assets);
        })
    );
});

self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
    console.log('SW is activated');
});

self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheResponse => {
            return cacheResponse || fetch(evt.request).then(fetchResponse => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request, fetchResponse.clone());

                    // Check cache size and remove old entries if necessary
                    return cache.keys().then(keys => {
                        if (keys.length > maxCacheSize) {
                            cache.delete(keys[0]); // Remove the oldest cache entry
                        }
                        return fetchResponse;
                    });
                });
            }).catch(() => caches.match('/fallback.html'));
        })
    );
});
