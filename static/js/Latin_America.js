// first Donut Chart
d3.json("/Latincase").then(response => {
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
  
  
  
  /////////////////////////////////////////////////////////////////////////////////////
  // Second Donut Chart
  d3.json("/Latincase").then(response => {
    const parsedData = response;
    const filteredData = parsedData.filter(row => row['DEATHS'] !== undefined && row['DEATHS']);
    const values = filteredData.map(row => parseFloat(row['DEATHS']));
    const labels = filteredData.map(row => row['Category']);
  
    const data = values.map((value, index) => ({ value, label: labels[index] }));
  
    data.sort((a, b) => b.value - a.value);
  
    const sortedValues = data.map(item => item.value);
    const sortedLabels = data.map(item => item.label);
  
    const customColors = ['#22b1b9', '#ccaeea', '#efcb6d', '#036264','#38a2ff', '#f77b1c', '#567e99', '#FFA6C3'];
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

///////////////////////////////////////////////////////////////////////////////////////////



// The map
const map = L.map('map').setView([-8, -75], 3); // Set initial map view to center around Costa Rica

// Add the Esri base layer to the map
const Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);

// Function to get color based on cancer type
function getCancerColor(cancerType) {
    // Define color mappings for different cancer types
    const colorMap = {
        'Lung': '#f4d650', // Lung cancer
        'Prostate': '#38a2ff', // Prostate cancer
        'Colorectum': '#acddbf', // Colorectum cancer
        'Stomach': '#ff683b', // Stomach cancer
        'Liver': '#af96cf', // Liver cancer
        'Gallbladder': '#2f3f58', // Gallbladder cancer
        'Cervix': '#c50604' // Cervix cancer
    };

    // Return color from the mapping, or null if not found
    return colorMap[cancerType] || null;
}

// Add the GeoJSON layer to the map
d3.json("/Latinmap")
    .then(geojsonData => {
        // Fetch data from Flask endpoint
        d3.json("/Latindeath")
            .then(commonCancerData => {
                L.geoJSON(geojsonData, {
                    style: function (feature) {
                        // Extract country code from GeoJSON properties
                        const countryCode = feature.properties.iso_a3;

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
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindTooltip(feature.properties.name); // Bind country name as tooltip on mouseover
                    }
                }).addTo(map);
            })
            .catch(error => console.error('Error fetching or parsing data from Flask endpoint:', error));
    })
    .catch(error => console.error('Error fetching or parsing GeoJSON:', error));

    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'info legend');
        let cancerName = ["Lung", "Prostate", "Colorectum", "Stomach", "Liver", "Gallbladder", "Cervix"];
        let colors = ["#f4d650", "#38a2ff", "#acddbf", "#ff683b", "#af96cf", "#2f3f58", "#c50604"];
        div.style.backgroundColor="#FFFFFF"
        div.style.padding="10px"
        div.innerHTML += '<p>Cancer</p>';
        // loop through our depth intervals and generate a label with a colored square for each interval
        for (let i = 0; i < colors.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'>" +"___" +"</i>" + cancerName[i] + '<br>';
                // "<i style='background: " + colors[i] + "'>" +"___" +"</i>" + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
               
        }
    
        return div;
    };
    legend.addTo(map);

/////////////////////////////////////////////////////////////////////////////////////////

// Latin America incident and mortality    
d3.json('/Latinincidents').then(function(responseData) {
  // Extracting data
  const categories = responseData.map(entry => entry.Category);
  const incidences = responseData.map(entry => entry.Incidence);
  const mortalities = responseData.map(entry => entry.Mortality);

  // Create trace for Incidence
  const trace1 = {
    x: incidences,
    y: categories,
    name: 'Incidence',
    orientation: 'h',
    type: 'bar',
    marker: {
      color: '#365359', // Color for Incidence bars
      line: {
        color: '#365359', // Border color for Incidence bars
        width: 1
      }
    },
    hoverinfo: 'x+y', // Show x and y values on hover
    hoverlabel: {
      bgcolor: '#365359', // Hover box background color for Incidence bars
      bordercolor: '#365359', // Hover box border color for Incidence bars
      font: { color: 'white' } // Font color for hover text
    }
  };

  // Create trace for Mortality
  const trace2 = {
    x: mortalities,
    y: categories,
    name: 'Mortality',
    orientation: 'h',
    type: 'bar',
    marker: {
      color: '#A3D9CF', // Color for Mortality bars
      line: {
        color: '#A3D9CF', // Border color for Mortality bars
        width: 1
      }
    },
    hoverinfo: 'x+y', // Show x and y values on hover
    hoverlabel: {
      bgcolor: '#A3D9CF', // Hover box background color for Mortality bars
      bordercolor: '#A3D9CF', // Hover box border color for Mortality bars
      font: { color: 'black' } // Font color for hover text
    }
  };

  const layout = {
    title: 'Incidence and Mortality by Category',
    xaxis: {
      title: 'ASP (World) per 100,000'
    },
    yaxis: {
      automargin: true, // Automatically adjust margin to fit labels
      tickmode: 'linear', // Show all ticks
      tick0: 0,
      dtick: 1
    },
    barmode: 'group', // Group bars by category
    bargap: 0.3, // Adjust the value to increase or decrease the gap between groups
    height: 700,
    width: 800
  };

  const data = [trace1, trace2];

  // Plot the chart
  Plotly.newPlot('plot', data, layout);
}).catch(function(error) {
  console.error('Error fetching data:', error);
});


///////////////////////////////////////////////////////////////////////////
// Get the current URL path
const currentPath = window.location.pathname;

// Get all the buttons in the header
const buttons = document.querySelectorAll('.header .btn');

// Loop through each button to check if its href matches the current path
buttons.forEach(button => {
  if (button.getAttribute('href') === currentPath) {
    // Add the 'active' class to the button if it matches the current path
    button.classList.add('active');
  }
});    