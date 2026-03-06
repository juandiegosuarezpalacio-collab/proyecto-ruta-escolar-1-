let estudiantes=[
{id:1,nombre:"Mateo Gómez",ruta:"Bachillerato",barrio:"La Esmeralda",tel:"573001234567",activo:true},
{id:2,nombre:"Lucía Fernández",ruta:"Bachillerato",barrio:"La Esmeralda",tel:"573119876543",activo:true},
{id:3,nombre:"Carlos Ruiz",ruta:"Primaria",barrio:"Centro",tel:"573155554433",activo:true}
];

let sectorActual=null;

document.addEventListener("DOMContentLoaded",()=>{

dibujarLista();

document.getElementById("filtro-ruta")
.addEventListener("change",dibujarLista);

document.getElementById("btnAviso")
.addEventListener("click",avisoMasivo);

iniciarGPS();

});

function iniciarGPS(){

if(!navigator.geolocation)return;

navigator.geolocation.watchPosition(pos=>{

document.getElementById("gps-indicator").innerText="🟢 GPS conectado";
document.getElementById("gps-indicator").className="gps-on";

detectarSector(
pos.coords.latitude,
pos.coords.longitude
);

});

}

function detectarSector(lat,lng){

sectorActual=null;

for(const b of BARRIOS){

const d=distancia(lat,lng,b.lat,b.lng);

if(d<200){
sectorActual=b;
break;
}

}

const box=document.getElementById("alerta-barrio");

if(sectorActual){

box.style.display="block";

document.getElementById("nombre-sector")
.innerText=sectorActual.nombre;

}else{

box.style.display="none";

}

}

function distancia(lat1,lon1,lat2,lon2){

const R=6371e3;

const p1=lat1*Math.PI/180;
const p2=lat2*Math.PI/180;

const dp=(lat2-lat1)*Math.PI/180;
const dl=(lon2-lon1)*Math.PI/180;

const a=Math.sin(dp/2)**2+
Math.cos(p1)*Math.cos(p2)*
Math.sin(dl/2)**2;

return R*(2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));

}

function dibujarLista(){

const ruta=document.getElementById("filtro-ruta").value;

const cont=document.getElementById("contenedor-estudiantes");

cont.innerHTML="";

estudiantes
.filter(e=>e.ruta===ruta)
.forEach(e=>{

const div=document.createElement("div");

div.className=`tarjeta ${e.activo?"":"inactivo"}`;

div.innerHTML=`
<div class="info" onclick="marcar(${e.id})">
<b>${e.nombre}</b>
<span>📍 ${e.barrio}</span>
</div>
<button class="btn-wa" onclick="wa('${e.tel}','${e.nombre}')">
WA
</button>
`;

cont.appendChild(div);

});

}

function marcar(id){

const e=estudiantes.find(x=>x.id===id);

e.activo=!e.activo;

dibujarLista();

}

function wa(tel,nombre){

const msg=encodeURIComponent(
`Ruta escolar: estamos cerca del sector, favor salir con ${nombre}.`
);

window.open(`https://wa.me/${tel}?text=${msg}`);

}

function avisoMasivo(){

if(!sectorActual)return;

const ruta=document.getElementById("filtro-ruta").value;

const grupo=estudiantes.filter(e=>
e.barrio===sectorActual.nombre &&
e.ruta===ruta &&
e.activo
);

grupo.forEach((e,i)=>{

setTimeout(()=>{
wa(e.tel,e.nombre);
},i*1500);

});

}