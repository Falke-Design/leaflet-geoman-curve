const tiles1 = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

const map = L.map('map').setView([51.505, -0.09], 13).addLayer(tiles1);

new L.PM.Curve(map);

map.pm.addControls();


var json = "[\"M\",[51.51564031787867,-0.04858016967773438],\"C\",[51.51564031787867,-0.04858016967773438],[51.48614706295008,-0.05046844482421876],[51.50623874398992,-0.10419845581054689],\"C\",[51.526330425029755,-0.15792846679687503],[51.4929877784271,-0.12325286865234376],[51.4929877784271,-0.12325286865234376],\"C\",[51.4929877784271,-0.12325286865234376],[51.521942559389544,-0.07158279418945314],[51.49031574610325,-0.06917953491210939],\"C\",[51.458688932816955,-0.06677627563476564],[51.51564031787867,-0.04858016967773438],[51.51564031787867,-0.04858016967773438]]";
var curve = L.curve(JSON.parse(json)).addTo(map)

/*
var marker = L.marker(map.getCenter()).addTo(map);
var m1 = L.marker(map.getCenter()).addTo(map);
var m2 = L.marker(map.getCenter()).addTo(map);

map.on('mousemove',(e)=>{
    var path = SVGPathCommander.parsePathString(curve._path.attributes.d.value)
    var p = SVGPathCommander.getClosestPoint(path, e.layerPoint)
    marker.setLatLng(map.layerPointToLatLng(p));

    var x = SVGPathCommander.getSegmentOfPoint(path,p);
    console.log(x)
});

*/
