async function main() {
    const queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
    const response = await fetch(queryUrl);
    data = await response.json()
    features = data.features
    console.log(features)
  
    earthquakes = [];
  
    for (i = 0; i < features.length; i++) {
      var quake = features[i];
      var mag = quake.properties.mag;
      var depth = quake.geometry.coordinates[2];
      var stamp = quake.properties.time;
      var date = new Date(stamp)
  
  
  
      var color = "";
      switch (true) {
        case (mag > 5):
          color = "	#800000";
          break;
        case (mag > 4):
          color = '	#FF99CC';
          break;
        case (mag > 3):
          color = 	"#FF9900";
          break;
        case (mag > 2):
          color = "#FFCC00";
          break;
        case (mag > 1):
          color = "##99CC00";
        default:
          color = "#CCFFCC";
      }
  
      markers = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
        opacity: .5,
        fillOpacity: .85,
        fillColor: color,
        color: '#800080',
        weight: 1,
        radius: mag * 20000
      }).bindPopup("Date: " + new Date(quake.properties.time) +
        "<br> Place:" + quake.properties.place + "<br> Magnitute: " + quake.properties.mag);
  
      earthquakes.push(markers)
    }
  
  
    var quakes = L.layerGroup(earthquakes)
  
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topographic = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    var baseMaps = {
      "Street Map": streetmap,
      "Topographic Map": topographic
    };
  
    let tectonicplates = new L.LayerGroup()
    let overlayMaps = {
      Earthquakes: quakes,
      'Tectonic Plates': tectonicplates
    };
  
  
    var map = L.map("map", {
      center: [40.80, -96.681],
      zoom: 4,
      layers: [streetmap, quakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  
    var legend = L.control({
      position: 'bottomright',
    });
  
    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend");
      var grades = [0, 1, 2, 3, 4, 5];
      var colors = [
        "#CCFFCC",
        "#99CC00",
        "#FFCC00",
        "#FF9900",
        "#FF99CC",
        "#800000"
      ];
  
      var legendtitle = "<h4>Magnitude</h4>";
      div.innerHTML = legendtitle
  
      var labels = [];
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background:" + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + '<br>' : "+");
      }
      return div;
    };
  
  
    legend.addTo(map)
  
    d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json').then(function (data) {
  
      L.geoJSON(data, {
        color: '#FF6600',
        weight: 1
      }).addTo(tectonicplates);
  
      tectonicplates.addTo(myMap)
    });
  
  };
  main()