self.addEventListener('install',(installEvent) => {
    console.log(`Service worker installed, ${installEvent}`);
    installEvent.waitUntil(self.skipWaiting());
});

self.addEventListener('message', (ev) => {
    console.log(`Receive message in worker : ${JSON.stringify(ev.data)}`);
});

self.addEventListener('activate', (activateEvent) => {
    console.log(`service worker activated ${activateEvent}`);
    activateEvent.waitUntil(self.claim());
});
