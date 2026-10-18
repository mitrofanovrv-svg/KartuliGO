/* Offline-only local files; no analytics, tracking, paid services. */
const CACHE='kartuligo-static-v3-20261018';
const FILES=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-180.png','./icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kartuligo-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);
 if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 e.respondWith((async()=>{
   try{const res=await fetch(e.request);if(res.ok){const cache=await caches.open(CACHE);cache.put(e.request,res.clone()).catch(()=>{});}return res;}
   catch{const cached=await caches.match(e.request,{ignoreSearch:true});return cached||Response.error();}
 })());
});
