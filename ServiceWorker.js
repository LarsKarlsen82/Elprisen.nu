const staticCacheName = 'site-static';
const maxCacheSize = 50; // Maximum number of items to keep in the cache

const assets = [
    '/',
    './index.html',
    './historik.html',
    './oversigt.html',
    './settings.html',
    './js/script.js',
    './css/style.css',
    'https://kit.fontawesome.com/7631ec8517.js',
    // './assets/images', 
];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('Caching shell assets');
            cache.addAll(assets);
        })
    );
});

self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
    console.log('SW is activated');
});

self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.open(staticCacheName).then(cache => {
            return cache.match(evt.request).then(cacheResponse => {
                const fetchPromise = fetch(evt.request).then(fetchResponse => {
                    cache.put(evt.request, fetchResponse.clone());

                    // Check cache size and remove old entries if necessary
                    return cache.keys().then(keys => {
                        if (keys.length > maxCacheSize) {
                            cache.delete(keys[0]); // Remove the oldest cache entry
                        }
                        return fetchResponse;
                    });
                });

                return cacheResponse || fetchPromise;
            });
        })
    );
});

// Link: https://www.youtube.com/watch?v=kT3qSf7jG5c&ab_channel=NetNinja