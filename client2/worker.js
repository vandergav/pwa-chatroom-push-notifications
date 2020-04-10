console.log("Service Worker Loaded...");

const cacheName = 'v2';

self.addEventListener("push", e => {
    const data = e.data.json();
    //console.log(e.data.json());
    console.log("Push Recieved...");
    self.registration.showNotification(data.title, {
        // body: "Notified by National Institute of Education",
        body: data.message,
        icon: data.image
    });
});

const cacheAssets = [
    './index.html',
    './client.js',
    // '../index.js'
];

// Call Install Event
self.addEventListener('install', e => {
    console.log('Service Worker: Installed');

    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});

// Call Activate Event
self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Call Fetch Event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

