// The Map
d3.select("#dropdown").on('change', function () {
  var dropdownRegion = d3.select("#dropdown").property('value');
  CountryMap(dropdownRegion);
});
const map = L.map('map').setView([0, 0], 2); // Set initial map view to a specific location and zoom level

// Add the Esri base layer to the map
const Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);
CountryMap("EuropeMale")
function CountryMap(dropdownCountry) {
  console.log(dropdownCountry)

fetch("https://gist.githubusercontent.com/NaderMoA/b345d653276912fa6e9a0f2aed6fdb25/raw/426fb47f0a6793776a044f17e66d17cbbf8061ad/countries.geo.json")
    .then(response => response.json())
    .then(geojsonData => {
        // Fetch data from Flask endpoint
        //`/${dropdownCountry}`
        d3.json(`/${dropdownCountry}`).then(commonCancerData => {
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
                            fillColor: feature.properties.fillColor , // Default fill color if no match found in fetched data
                            color: 'white', // Default border color
                            weight: 1, // Default border width
                            fillOpacity: 1 // Default fill opacity
                        };
                    }
                }).addTo(map);
            })
            .catch(error => console.error('Error fetching or parsing data from Flask endpoint:', error));
    })
    .catch(error => console.error('Error fetching or parsing GeoJSON:', error))
  }

// Function to get color based on cancer type
function getCancerColor(cancerType) {
    // Define color mappings for different cancer types
    const colorMap = {
        'Lung': '#22b1b9', // Red for Lung cancer
        'Prostate': '#f4d650', // Green for Prostate cancer
        "Breast": "pink",
        "Colorectum": "#c50604"
    };

    // Return color from the mapping, or a default color if not found
    return colorMap[cancerType] || 'grey'; // Default to black if no match found
}
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let cancerName = ["Lung", "Prostate", "Breast", "Colorectum"];
    let colors = ["#22b1b9", "#f4d650", "pink", "#c50604"];
    div.style.backgroundColor="#FFFFFF"
    div.style.padding="10px"
    div.innerHTML += '<h4>Depth</h4>';
    // loop through our depth intervals and generate a label with a colored square for each interval
    for (let i = 0; i < colors.length; i++) {
        div.innerHTML +=
            "<i style='background: " + colors[i] + "'>" +"___" +"</i>" + cancerName[i] + '<br>';
            // "<i style='background: " + colors[i] + "'>" +"___" +"</i>" + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
           
    }

    return div;
};
legend.addTo(map);
// First Donut Chart

d3.json("/Europe3").then(response => {
  console.log(response)
  const parsedData = response;
  const filteredData = parsedData.filter(row => 
    row['CASES'] !== undefined && row['CASES'] !== null && +row['CASES'] !== 0 && row['Category'] !== 0 && row['Category'] !== '');
  const values = filteredData.map(row => parseFloat(row['CASES']));
  const labels = filteredData.map(row => row['Category']);

  const data = values.map((value, index) => ({ value, label: labels[index] }));

  data.sort((a, b) => b.value - a.value);

  const sortedValues = data.map(item => item.value);
  const sortedLabels = data.map(item => item.label);

  const customColors = ['#e5526f', '#f4d650', '#acddbf', '#ff683b', '#2f3f58', '#af96cf', '#c50604', '#2573a1'];
  const width = 700;
  const height = 500;
  const radius = Math.min(width, height) / 3;
  const arcPadding = 0.01;
  const validValues = sortedValues.filter(value => !isNaN(value));
  const totalcases = (validValues.reduce((a, b) => a + b, 0) * 10 ** -6).toFixed(1);

  let arc = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius)
    .cornerRadius(5)
    .padAngle(arcPadding);

  const pie = d3.pie()
    .sort(null)
    .value(d => d);

  const svg = d3.select("#donut_chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const g = svg.selectAll(".arc")
    .data(pie(sortedValues))
    .enter().append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc)
    .style("fill", (_, i) => customColors[i])
    .on("mouseover", function (event, d) {
      d3.select(this).style("filter", "url(#drop-shadow)");
    })
    .on("mouseout", function () {
      d3.select(this).style("filter", "none");
    });

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text(`${totalcases}M CASES`)
    .style("font-size", "20px")
    .style("fill", "black");

  const labelGroup = svg.append("g").attr("class", "labels").selectAll("text")
    .data(pie(sortedValues))
    .enter()
    .append("text")
    .style("opacity", 0)
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .text((d, i) => `${sortedLabels[i]}: ${(100 * sortedValues[i] / sortedValues.reduce((a, b) => a + b, 0)).toFixed(1)}%`)
    .style("font-size", "12px")
    .style("fill", "black");

    g.on("mouseover", function (event, d) {
      labelGroup.style("opacity", (_, i) => i === d.index ? 1 : 0);
      g.style("opacity", (_, i) => i === d.index ? 1 : 0.3);
      
      // Append a white background rectangle behind the hovered label
      labelGroup.filter((_, i) => i === d.index)
        .each(function() {
          const bbox = this.getBBox(); // Get bounding box of the label
          const centroid = arc.centroid(d); // Get centroid of the arc
          const labelX = centroid[0] - bbox.width / 2 - 5; // Adjust padding as needed
          const labelY = centroid[1] - bbox.height / 2 - 2; // Adjust padding as needed
          
          d3.select(this.parentNode).insert("rect", ":first-child")
            .attr("class", "label-background")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("width", bbox.width + 10) // Adjust padding as needed
            .attr("height", bbox.height + 4)
            .attr("fill", "white");
        });
      
      // Change fill color of the hovered label text to black
      labelGroup.filter((_, i) => i === d.index)
        .style("fill", "black")
        .style("font-weight", "bold");
    }).on("mouseout", function () {
      labelGroup.style("opacity", 0);
      g.style("opacity", 1);
      
      // Remove the background rectangle and reset fill color on mouseout
      svg.selectAll(".label-background").remove();
      labelGroup.style("fill", "black");
    });

  const defs = svg.append("defs");
  const filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

  filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 10)
    .attr("result", "blur");

  filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 3)
    .attr("dy", 3)
    .attr("result", "offsetBlur");

  const feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "offsetBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");
// Add legend
const legend = svg.selectAll(".legend")
.data(sortedLabels)
.enter()
.append("g")
.attr("class", "legend")
.attr("transform", (d, i) => `translate(200,${i * 20})`); // Adjust vertical spacing between legend items

legend.append("rect")
.attr("width", 10)
.attr("height", 10)
.attr("fill", (d, i) => customColors[i]);

legend.append("text")
.text(d => d)
.style("font-size", 12)
.attr("y", 10)
.attr("x", 11)
})
.catch(error => console.error('Error fetching CSV:', error));

// Second Donut Chart
d3.json("/Europe2").then(response => {
  const parsedData = response;
  const filteredData = parsedData.filter(row => row['DEATHS'] !== undefined && row['DEATHS']);
  const values = filteredData.map(row => parseFloat(row['DEATHS']));
  const labels = filteredData.map(row => row['Category']);

  const data = values.map((value, index) => ({ value, label: labels[index] }));

  data.sort((a, b) => b.value - a.value);

  const sortedValues = data.map(item => item.value);
  const sortedLabels = data.map(item => item.label);

  const customColors = ['#22b1b9', '#ccaeea', '#efcb6d', '#036264','#38a2ff', '#f77b1c', '#567e99', '#ffc215',];
  const width = 700;
  const height = 500;
  const radius = Math.min(width, height) / 3;
  const arcPadding = 0.01;

  const validValues = sortedValues.filter(value => !isNaN(value));
  const totalDeaths = (validValues.reduce((a, b) => a + b, 0) * 10 ** -6).toFixed(1);

  let arc = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius)
    .cornerRadius(5)
    .padAngle(arcPadding);

  const pie = d3.pie()
    .sort(null)
    .value(d => d);

  const svg = d3.select("#donut_chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const g = svg.selectAll(".arc")
    .data(pie(sortedValues))
    .enter().append("g")
    .attr("class", "arc");

    g.append("path")
    .attr("d", arc)
    .style("fill", (_, i) => customColors[i])
    .attr("stroke", "none") // Ensure no stroke color
    .on("mouseover", function (event, d) {
      d3.select(this).style("filter", "url(#drop-shadow)");
    })
    .on("mouseout", function () {
      d3.select(this).style("filter", "none");
    });

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .text(`${totalDeaths}M DEATHS`)
    .style("font-size", "20px")
    .style("fill", "black");

  const labelGroup = svg.append("g").attr("class", "labels").selectAll("text")
    .data(pie(sortedValues))
    .enter()
    .append("text")
    .style("opacity", 0)
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .text((d, i) => `${sortedLabels[i]}: ${(100 * sortedValues[i] / sortedValues.reduce((a, b) => a + b, 0)).toFixed(1)}%`)
    .style("font-size", "12px")
    .style("fill", "black");

    g.on("mouseover", function (event, d) {
      labelGroup.style("opacity", (_, i) => i === d.index ? 1 : 0);
      g.style("opacity", (_, i) => i === d.index ? 1 : 0.3);
      
      // Append a white background rectangle behind the hovered label
      labelGroup.filter((_, i) => i === d.index)
        .each(function() {
          const bbox = this.getBBox(); // Get bounding box of the label
          const centroid = arc.centroid(d); // Get centroid of the arc
          const labelX = centroid[0] - bbox.width / 2 - 5; // Adjust padding as needed
          const labelY = centroid[1] - bbox.height / 2 - 2; // Adjust padding as needed
          
          d3.select(this.parentNode).insert("rect", ":first-child")
            .attr("class", "label-background")
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("width", bbox.width + 10) // Adjust padding as needed
            .attr("height", bbox.height + 4)
            .attr("fill", "white");
        });
      
      // Change fill color of the hovered label text to black
      labelGroup.filter((_, i) => i === d.index)
        .style("fill", "black")
        .style("font-weight", "bold");
    }).on("mouseout", function () {
      labelGroup.style("opacity", 0);
      g.style("opacity", 1);
      
      // Remove the background rectangle and reset fill color on mouseout
      svg.selectAll(".label-background").remove();
      labelGroup.style("fill", "black");
    });

  const defs = svg.append("defs");
  const filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

  filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 10)
    .attr("result", "blur");

  filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 3)
    .attr("dy", 3)
    .attr("result", "offsetBlur");

  const feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "offsetBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");
// Add legend
const legend = svg.selectAll(".legend")
.data(sortedLabels)
.enter()
.append("g")
.attr("class", "legend")
.attr("transform", (d, i) => `translate(200,${i * 20})`); // Adjust vertical spacing between legend items

legend.append("rect")
.attr("width", 10)
.attr("height", 10)
.attr("fill", (d, i) => customColors[i]);

legend.append("text")
.text(d => d)
.style("font-size", 12)
.attr("y", 10)
.attr("x", 11)
})
.catch(error => console.error('Error fetching CSV:', error));
