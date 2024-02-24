let EUmap = L.map('map').setView([51.505, -0.09], 4);

// Add a tile layer (for background)
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'your.mapbox.access.token'
}).addTo(EUmap);

// Load GeoJSON data for European countries
fetch('europe.geojson')
  .then(response => response.json())
  .then(data => {
    // Add GeoJSON layer to the map
    L.geoJSON(data).addTo(EUmap);
  });