// The Map

// Initialize Leaflet map
const map = L.map('map').setView([0, 0], 2); // Set initial map view to a specific location and zoom level

// Add the Esri base layer to the map
const Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);

// Fetch GeoJSON data
fetch("https://gist.githubusercontent.com/NaderMoA/b345d653276912fa6e9a0f2aed6fdb25/raw/426fb47f0a6793776a044f17e66d17cbbf8061ad/countries.geo.json")
    .then(response => response.json())
    .then(geojsonData => {
        // Fetch data from Flask endpoint
        fetch("/Europe") // Assuming your Flask route for fetching data is '/Europe'
            .then(response => response.json())
            console.log("this is eu data")
            console.log(response)
            .then(commonCancerData => {
                // Loop through GeoJSON features
                geojsonData.features.forEach(feature => {
                    // Extract id from GeoJSON properties
                    const id = feature.id;

                    // Find corresponding data in fetched data
                    const rowData = commonCancerData.find(row => row['ISO_3_CODE'] === id);

                    // If data found, customize GeoJSON feature style
                    if (rowData) {
                        const cancerType = rowData['VALUE'];
                        // Customize the fill color based on cancer type
                        feature.properties.fillColor = getCancerColor(cancerType);
                    }
                });

                // Add the GeoJSON layer to the map
                L.geoJSON(geojsonData, {
                    style: function(feature) {
                        return {
                            fillColor: feature.properties.fillColor || '#ffffff', // Default fill color if no match found in fetched data
                            color: '#000000', // Default border color
                            weight: 1, // Default border width
                            fillOpacity: 0.7 // Default fill opacity
                        };
                    }
                }).addTo(map);
            })
            .catch(error => console.error('Error fetching or parsing data from Flask endpoint:', error));
    })
    .catch(error => console.error('Error fetching or parsing GeoJSON:', error));

// Function to get color based on cancer type
function getCancerColor(cancerType) {
    // Define color mappings for different cancer types
    const colorMap = {
        'Lung': '#ff0000', // Red for Lung cancer
        'Prostate': '#00ff00', // Green for Prostate cancer
        // Add more mappings as needed
    };

    // Return color from the mapping, or a default color if not found
    return colorMap[cancerType] || '#000000'; // Default to black if no match found
}