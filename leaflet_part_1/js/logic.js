// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function createFeatures(earthquakeData) {
        function onEachFeature(feature, layer) {
            layer.bindPopup("<h3>Earthquake Details</h3>" + "<br>Location: " + feature.properties.place + "<br>Magnitude: " + feature.properties.mag + `<p>Date: ${new Date(feature.properties.time)}</p>` +"<br> Depth: " + feature.geometry.coordinates[2]+ "km");
    }
     
        function colorChart(depth) {
            return depth > 90 ? '#DC3220':
                depth > 70 ? '#D07F36':
                    depth > 50 ? '#E4BF45':
                        depth > 30 ? '#FEFE62':
                            depth > 10 ? '#84c880':
                                '#bcb1f2';
        }

          
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: feature.properties.mag * 5,
            fillColor: colorChart(feature.geometry.coordinates[2]),
            color: '#f7b962',
            weight: 1.42,
            opacity: 1,
            fillOpacity: 0.62
        });
      }
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Create the base layers.
    
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let baseMaps = {
        'Street Map': street,
        'Topographic Map': topo
    };

    let overlayMaps = {
        Earthquakes: earthquakes
    };
    let myMap = L.map("map", {
        center: [
          41.623655, -93.592339
        ],
        zoom: 4.2,
        layers: [street, earthquakes]
      });

      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

    // Set up the legend.
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    let ground = [-10, 10, 30, 50, 70, 90];
    let labels = [];
   
    const colors = [
        '#bcb1f2',
        '#84c880',
        '#FEFE62',
        '#E4BF45',
        '#D07F36',
        '#DC3220'
    ];

    let legendInfo = "<h3>Earthquake Depth in km</h3>" +
    "<div class=\"labels\">" +
      "<div class=\"min\">" + ground[0] + "</div>" +
      "<div class=\"max\">" + ground[ground.length - 1] + "</div>" +
    "</div>";

  div.innerHTML = legendInfo;

  ground.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding the legend to the map
  legend.addTo(myMap)
};