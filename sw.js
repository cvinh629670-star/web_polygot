// Cache nội dung học tĩnh. Không lưu yêu cầu API hay dữ liệu bên ngoài ứng dụng.
const CACHE = 'polyglot-shell-v8';
const shell = [
 './index.html','./manifest.webmanifest','./css/app.css','./css/graphics.css','./css/grammar-lab.css',
 './assets/app-ui.js','./assets/app-ui.css','./assets/fontawesome.css','./assets/fa-solid-900.woff2',
 './assets/fa-regular-400.woff2','./assets/grammar-lab-tutor.webp',
 './assets/polyglot-icon-192.png','./assets/polyglot-icon-512.png','./js/local-data.js','./js/starter-vocabulary.js',
 './js/app.js','./js/audio.js','./js/ui-bridge.js','./js/offline.js','./js/language-practice.js',
 './js/grammar-lab/content.js','./js/grammar-lab/repository.js','./js/grammar-lab/engine.js','./js/grammar-lab/ui.js'
];
const urls = new Set(shell.map(path => new URL(path,self.registration.scope).href));
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(shell))));
self.addEventListener('activate', event => event.waitUntil((async ()=>{
 for (const key of await caches.keys()) if (key.startsWith('polyglot-shell-') && key!==CACHE) await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
 const request = event.request;
 if (request.method!=='GET') return;
 const url=new URL(request.url);
 if (!url.href.startsWith(self.registration.scope) || !['navigate','same-origin','cors','no-cors'].includes(request.mode)) return;
 const isPage = request.mode==='navigate' && [new URL('./',self.registration.scope).pathname,new URL('./index.html',self.registration.scope).pathname].includes(url.pathname);
 if (!isPage && !urls.has(url.href)) return;
 event.respondWith((async ()=>{
  const cache=await caches.open(CACHE);
  const key=isPage ? new URL('./index.html',self.registration.scope).href : request;
  try {
   const response=await fetch(request);
   if (response.ok) await cache.put(key,response.clone());
   return response;
  } catch {
   return await cache.match(key) ?? Response.error();
  }
 })());
});
