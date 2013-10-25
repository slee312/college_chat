var map;
var check_time_out;
var room_markers = new Array();


$(function() {
  // check if we are in the listings page or the room specific page
  if ($('#map-container').length > 0) {
    configListings();
  } else {
    configRoomSpecific();
  }
});

function configListings() {
  setUpMap();
  checkGeo();
  $('#get_loc_btn').click(function() {
    checkGeo();
  });
}

function configRoomSpecific() {
  configPostAction();
  checkUpdates();
  setInterval(checkUpdates, 1000);
}

function checkUpdates() {
  // send get request
  $.get('/messages', {room_id: $('[name="message[room_id]"]').val()}, null, "script");
}

function configPostAction() {
  $('#new_message').submit(function() {
    // reset messages feed
    $('#messages_feed').html("");
    $('#message_content').focus();

    // disable post button
    $('#post-submit').prop('disabled', true);
    $('#post-submit').val('Posting...');

    // send post request
    $.post($(this).attr("action") + ".js", $(this).serialize(), null, "script");

    return false;
  });
}

function setUpMap() {
  // set up chatbox marker icon
  L.Icon.Default.imagePath = "/assets";

  // default view to focus on Commons
  map = L.map('map-container').setView([-76.6170049, 39.3284174],16);
  var attr_info = "Tiles Courtesy of <a href=\"http://www.mapquest.com/\" target=\"_blank\">MapQuest    </a>; Data &copy; <a href=\"http://www.openstreetmap.org\" target=\"blank\">OpenStreetMap</a>";
  L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', { attribution: attr_info, maxZoom: 18, subdomains: ['otile1', 'otile2', 'otile3', 'otile4'] }).addTo(map);


  // add room markers
  addRoomMarkers();
}

function addRoomMarkers() {
  // save the room names and associated locations into memory
  var room_names = new Array();
  var room_paths = new Array();
  var room_lats = new Array();
  var room_longs = new Array();
  
  var i = 0;
  $('.room-name').each(function() {
    room_names[i] = $(this).html();
    room_paths[i] = $(this).attr('href');
    i++
  });

  i = 0;
  $('.room-loc').each(function() {
    var regex = /[-\d\.]+/g
    var loc = $(this).val();

    room_lats[i]  = parseFloat(regex.exec(loc)[0]);
    room_longs[i] = parseFloat(regex.exec(loc)[0]);
    i++
  });

  // actually place the markers
  for (var i = 0 ; i < room_names.length; i++) {
    room_markers.push(L.marker([room_lats[i], room_longs[i]]).addTo(map));
    room_markers[i].bindPopup("<a href = \"" + room_paths[i] + "\">" + room_names[i] + "</a>");
  }
}

function checkGeo() {
  check_time_out = setTimeout(function() { error_geo_callback(null); }, 20000);

  //disable button and indicate loading
  $('#get_loc_btn').prop('disabled', true);
  $('#get_loc_btn').html('Retrieving Location');

  if (geoPosition.init()) {
    geoPosition.getCurrentPosition(success_geo_callback, error_geo_callback, {enableHighAccuracy: true, timeout: 20000});
    
  } else {
    alert("Looks like your browser doesn't support geolocaton detection. Try updating!");
  }
}

function success_geo_callback(geo) {
  clearTimeout(check_time_out);
  var user_lat = geo.coords.latitude;
  var user_long = geo.coords.longitude;

  //Add hidden coords
  $('#verify_lat').val(user_lat);
  $('#verify_long').val(user_long);

  $('#get_loc_btn').prop('disabled', false);
  $('#get_loc_btn').html('Get Current Location');

  map = map.setView([user_lat, user_long],16);

  // place a "here" popup to denote location
  /*
  var here_popup = L.popup({closeOnClick: false}).setContent("You are here");
  here_popup.setLatLng([user_lat, user_long]);
  here_popup.openOn(map);
  */

}

function error_geo_callback(geo) {
  clearTimeout(check_time_out);
  var errorMsg;
  if (geo && geo.message.indexOf('expired') < 0) {
   errorMsg = "There was an error in finding your location.\n If you have previously denied location access, try resetting your browser location settings.";
  } else {
    errorMsg = "Geotracking timed out. Please try again later.";
  }

  alert(errorMsg);

  $('#get_loc_btn').prop('disabled', false);
  $('#get_loc_btn').html('Get Current Location');
}
