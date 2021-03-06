var socket = io.connect(":3000");

var map = undefined;
var marker = undefined;

function sendLocation(latLng){
  socket.emit("location",latLng);
}

function placeMarkerAndPanTo(latLng, map) {
  if(marker == undefined) {
    marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
  }else{
    marker.setPosition(latLng);
  }
  map.panTo(latLng);
  sendLocation(latLng);
}


function initMap() {
  mapDiv = document.getElementById('map');
  var lat = store.get("lat");
  var lng = store.get("lng");
  if(lat == undefined || lng == "undefined") lat = 0;
  if(lng == undefined || lng == "undefined") lng = 0;

  var map = new google.maps.Map(mapDiv, {
    center:{lat: lat, lng: lng },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 18
  });

  placeMarkerAndPanTo({lat: lat, lng: lng }, map);

  map.addListener('click', function(e) {
    store.set("lat", e.latLng.lat());
    store.set("lng", e.latLng.lng());

    placeMarkerAndPanTo(e.latLng, map);
  });

  navigator.geolocation.getCurrentPosition(function(position) {
    if(lat || lng) return;

    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    store.set("lat", lat);
    store.set("lng", lng);

    placeMarkerAndPanTo(pos, map);

    map.setCenter(pos);
  }, function() {

  });
}

$(function(){
  var fileref=document.createElement('script')
  fileref.setAttribute("type","text/javascript")
  fileref.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key="+config.maps+"&callback=initMap")

  $("body").first().append(fileref);
});
