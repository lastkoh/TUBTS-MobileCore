var HomePage = (function() {
  //   var API_URL = "https://fyp-postgrest.herokuapp.com/";

  var API = {
    URL: "https://fyp-postgrest.herokuapp.com/",

    ROUTE: {
      TABLE: "routes",
      ROUTE_ID: "route_id",
      ROUTE_NAME: "name",
      GMAP_PATH: "gmap_line",
      GMAP_PATH_COLOR: "gmap_line_color",
      GMAP_CENTER_LAT: "gmap_center_lat",
      GMAP_CENTER_LON: "gmap_center_lon",
      GMAP_ZOOM_LEVEL: "gmap_zoom_level",
      SERVICE_ID: "service_id"
    },

    ROUTES_STOPS: {
      TABLE: "routes_stops",
      ID: "id",
      ROUTE_ID: "route_id",
      STOP_ID: "stop_id",
      SEQUENCE: "sequence"
    },

    STOPS: {
      TABLE: "stops",
      STOP_ID: "stop_id",
      NAME: "name",
      LAT: "lat",
      LON: "lon"
    },

    SERVICES: {
      TABLE: "services",
      SERVICE_ID: 'service_id',
      DAYS: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    }
  };

  var UI = {
    selector: $("#selector"),
    materalizeSelect: $('select'),
    modal: $('#route_info_modal'),
    infoBtn: $('#btn_trip'),

    nextStop: $('#next_stop'),
    eta: $('#eta_min:not("sub")')
  };

  var DAYS = {
    'monday': 'Mon',
    'tuesday': 'Tues',
    'wednesday': 'Wed',
    'thursday': 'Thurs',
    'friday': 'Fri',
    'saturday': 'Sat',
    'sunday': 'Sun'
  };

  var DAYS_ARRAY = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  var selectedRouteId = null;
  var routesData = {};

  var gmap = null;
  var gmapMarkers = [];
  var gmapLine = null;
  var vehicleWorker = null;
  var vehicleMarker = null;
  var vehicleOrigin = null;
  var interval = null;
  var infoWindow = null;

  function updateInfo(nextStopName, etaInMins) {
    UI.nextStop.text(nextStopName);
    UI.eta[0].childNodes[0].nodeValue = etaInMins + " ";
  }

  function clearMap() {
    if (gmapMarkers.length !== 0 && gmapLine != null) {
      for (var i = 0; i < gmapMarkers.length; i++) {
        gmapMarkers[i].setMap(null);
      }
      gmapMarkers = [];

      if (gmapLine != null) {
        gmapLine.setMap(null);
        gmapLine = null;
      }

      if (vehicleMarker != null) {
        vehicleMarker.setMap(null);
        vehicleMarker = null;
      }
    }
  }

  function startAnimation(routeId) {
    vehicleWorker = new Worker('js/VehicleWorker.js');
    vehicleWorker.postMessage(JSON.stringify({
      'route_id': routeId
    }));
    interval = setInterval(function() {
      vehicleWorker.postMessage(JSON.stringify({
        'route_id': routeId
      }));
    }, 30000)
    vehicleWorker.onmessage = function(e) {
      if (e.data != null) {
        var json = JSON.parse(e.data);
        vehicleMarker.setPosition(new google.maps.LatLng(json.lat, json.lng));
        updateInfo(json.next_stop_name, json.eta_mins);
      } else {
        console.log("Set the bus to original stop");
        vehicleMarker.setPosition(vehicleOrigin);
        updateInfo("None", 0);
      }
    }
  }

  function stopAnimation() {
    if (vehicleWorker != null) {
      vehicleWorker.terminate();
    }

    if (interval != null) {
      clearInterval(interval);
    }

    vehicleOrigin = null;
    interval = null;
    vehicleWorker = null;
  }

  function toStrParams(params) {
    var str = '?';
    for (var key in params) {
      var paramStr = key + '=' + params[key] + '&'
      str += paramStr;
    }
    return str;
  }

  function updateRoute(routeId) {
    stopAnimation();
    clearMap();
    var todayDay = DAYS_ARRAY[new Date().getDay()];
    var json = routesData[routeId];
    console.log(json);

    gmap.setCenter(new google.maps.LatLng(json[API.ROUTE.GMAP_CENTER_LAT], json[API.ROUTE.GMAP_CENTER_LON]));
    gmap.setZoom(json[API.ROUTE.GMAP_ZOOM_LEVEL]);
    gmapLine = new google.maps.Polyline({
      path: google.maps.geometry.encoding.decodePath(json[API.ROUTE.GMAP_PATH]),
      strokeColor: json[API.ROUTE.GMAP_PATH_COLOR],
      strokeWeight: 4,
      map: gmap
    });
    gmapLine.setMap(gmap);

    var routesStops = json.routes_stops;
    for (var i = 0; i < routesStops.length; i++) {
      gmapMarkers[i] = new google.maps.Marker({
        position: new google.maps.LatLng(routesStops[i].stops.lat, routesStops[i].stops.lon),
        title: routesStops[i].stops.name,
        label: (i + 1).toString(),
        map: gmap
      });

      if (i === 0) {
        vehicleOrigin = new google.maps.LatLng(routesStops[i].stops.lat, routesStops[i].stops.lon);
        vehicleMarker = new google.maps.Marker({
          position: vehicleOrigin,
          map: gmap,
          icon: 'https://s17.postimg.org/ltgi31vgf/bus_pin_maker.png'
        })
      }
    }

    if (json[API.SERVICES.TABLE][todayDay]) {
      console.log("The service is available on today: " + todayDay);
      startAnimation(routeId);
    }
  }

  function bindUIActions() {
    UI.selector.on("change", function() {
      if (this.value !== selectedRouteId) {
        selectedRouteId = this.value;
        updateRoute(selectedRouteId);
      }
    });

    UI.infoBtn.on("click", function() {
      UI.modal.modal('open');
      var data = routesData[selectedRouteId];
      $('#route_info_title').text(data.name);

      $('#service_days').empty();
      $('#service_days').append('Available: ');
      for (var key in DAYS) {
        var tempStr = '<span class="grey-text">' + DAYS[key] + ' </span>';
        if (data.services[key]) {
          tempStr = '<span class="red-text text-darken-4">' + DAYS[key] + ' </span>'
        }

        $('#service_days').append(tempStr);
      }

      $('#stops_list').empty();
      var routesStops = data.routes_stops;
      for (var i = 0; i < routesStops.length; i++) {
        var item = '<li><div class="collapsible-header"><span class="new badge" data-badge-caption=""><b>' +
          (i + 1) + '</b></span><h6><p class="flow-text">' +
          routesStops[i].stops.name + '</p></h6></div><div class="collapsible-body"><img src=' +
          routesStops[i].stops.imgurl + '></div></li>';
        $('#stops_list').append(item);
      }
      $('#stops_list img').css({
        'max-width': '100%'
      });
    });
  }

  return {
    init: function() {
      gmap = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {
          lat: 3.07044,
          lng: 101.613
        },
        mapTypeId: 'roadmap'
      });
      gmap.setMapTypeId(google.maps.MapTypeId.ROADMAP);

      UI.nextStop.text("None");
      UI.eta[0].childNodes[0].nodeValue = "0 ";

      var payload = {
        'order': 'route_id.asc',
        'select': '*,services{*},routes_stops{stops{*}}',
        'routes_stops.order': 'sequence.asc'
      };

      $.getJSON(API.URL + "routes", payload, function(json) {
        UI.selector.empty();
        for (var i = 0; i < json.length; i++) {
          routesData[json[i].route_id] = json[i];

          if (i === 0) {
            selectedRouteId = json[i].route_id;
          }
          var option = document.createElement('option');
          option.text = json[i].name;
          option.value = json[i].route_id;
          UI.materalizeSelect.append(option);
        }
        UI.materalizeSelect.material_select();
        updateRoute(selectedRouteId);
      });

      bindUIActions();
    }
  };
})();