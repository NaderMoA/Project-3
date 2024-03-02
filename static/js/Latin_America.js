// The map
const map = L.map('map').setView([10, -84], 6); // Set initial map view to center around Costa Rica

// Add the Esri base layer to the map
const Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);

// Function to get color based on cancer type
function getCancerColor(cancerType) {
    // Define color mappings for different cancer types
    const colorMap = {
        'Lung': '#22b1b9', // Lung cancer
        'Prostate': '#f4d650', // Prostate cancer
        'Colorectum': '#c50604', // Colorectum cancer
        'Stomach': '#1fda9a', // Stomach cancer
        'Liver': '#e59e20', // Liver cancer
        'Gallbladder': '#7d3eb5', // Gallbladder cancer
        'Cervix': '#ed34ac' // Cervix cancer
    };

    // Return color from the mapping, or null if not found
    return colorMap[cancerType] || null;
}

// Add the GeoJSON layer to the map
fetch("/Latinmap")
    .then(response => response.json())
    .then(geojsonData => {
        // Fetch data from Flask endpoint
        fetch("/Latindeath")
            .then(response => response.json())
            .then(commonCancerData => {
                L.geoJSON(geojsonData, {
                    style: function (feature) {
                        // Extract country code from GeoJSON properties
                        const countryCode = feature.properties.sov_a3;

                        // Find corresponding data in fetched data
                        const rowData = commonCancerData.find(row => row['ISO_3_CODE'] === countryCode);

                        // If data found, customize GeoJSON feature style
                        if (rowData) {
                            const cancerType = rowData['VALUE'];
                            const fillColor = getCancerColor(cancerType);
                            if (fillColor) {
                                return {
                                    fillColor: fillColor,
                                    color: 'white', // Border color
                                    weight: 1, // Border width
                                    fillOpacity: 1 // Default fill opacity
                                };
                            }
                        }

                        // Default style if no data found
                        return {
                            fillColor: null,
                            color: 'white', // Border color
                            weight: 1, // Border width
                            fillOpacity: 0 // No fill
                        };
                    }
                }).addTo(map);
            })
            .catch(error => console.error('Error fetching or parsing data from Flask endpoint:', error));
    })
    .catch(error => console.error('Error fetching or parsing GeoJSON:', error));