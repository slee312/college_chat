$(function() {
  setUpMap();
});

function setUpMap() {
  L.Icon.Default.imagePath = "/assets";
  var map = L.map('map-container').setView([22.2833, 114.1500],16);
  var attr_info = "Tiles Courtesy of <a href=\"http://www.mapquest.com/\" target=\"_blank\">MapQuest    </a>; Data &copy; <a href=\"http://www.openstreetmap.org\" target=\"blank\">OpenStreetMap</a>";
  L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', { attribution: attr_info, maxZoom: 18, subdomains: ['otile1', 'otile2', 'otile3', 'otile4'] }).addTo(map);
  //Add Map Marker
  var here_marker = L.marker([22.2833, 114.1500]).addTo(map).bindPopup("Charles Commons");
}
