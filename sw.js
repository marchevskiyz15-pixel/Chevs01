/* Chefs 01: офлайн. Страница — из сети, если ответила за 2,5 с, иначе из памяти; остальное — из памяти */
var CACHE='chefs01-2026-10-31b';
var CORE=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','icon-512-maskable.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
function fromCache(){return caches.match('index.html').then(function(h){return h||caches.match('./')})}
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(r.mode==='navigate'){
    e.respondWith(new Promise(function(done){var sent=false;
      var t=setTimeout(function(){fromCache().then(function(h){if(h&&!sent){sent=true;done(h)}})},2500);
      fetch(r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put('index.html',cp)})}if(!sent){sent=true;clearTimeout(t);done(res)}})
        .catch(function(){fromCache().then(function(h){if(!sent){sent=true;clearTimeout(t);done(h||Response.error())}})});
    }));return}
  var fonts=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(u.origin!==location.origin&&!fonts)return;
  e.respondWith(caches.match(r).then(function(hit){return hit||fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque')){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}return res})}));
});
