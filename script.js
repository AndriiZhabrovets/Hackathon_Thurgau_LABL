let myMap = L.map("map").setView([47.535599, 9.140040], 10);

L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors; <a href="http://cartodb.com/attributions">CartoDB</a>' 
}).addTo(myMap);


text = "id;Código postal;Localidad;Valoracion;lat;lng\n1;46100;Burjassot;8;39.51;-0.425055\n2;18005;Granada;7;37.169266;-3.597161";

var lines = text.split("\n");
var heatData = [];
for (var i=1; i<lines.length; i++) {
    var parts = lines[i].split(";");
    heatData.push( [ parts[4], parts[5], parts[3] ] );
    }

var heat = L.heatLayer(heatData, {radius: 25}).addTo(map);