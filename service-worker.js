self.addEventListener("install",e=>{

e.waitUntil(
caches.open("ruta-cache").then(cache=>{
return cache.addAll([
"/",
"/index.html",
"/estilos.css",
"/app.js",
"/barrios.js"
]);
})
);

});

self.addEventListener("fetch",e=>{

e.respondWith(
caches.match(e.request)
.then(res=>res||fetch(e.request))
);

});