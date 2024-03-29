// first Donut Chart
d3.json("/Northamericacase").then(response => {
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
  ///////////////////////////////////////////////////////////////////////////////
  // Second Donut Chart
  d3.json("/Northamericadeath").then(response => {
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // //The map
  // const map = L.map('map').setView([55, -97], 3); // Set initial map view to center of North America

  // // Add the Esri base layer to the map
  // const Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  //     attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  //     maxZoom: 16
  // }).addTo(map);
  
  // // Fetch JSON data from Flask route for US state rates
  // d3.json("/Northamericamap").then(response => {
  //   console.log(response)
      
  //         // Store the data in a variable accessible to the GeoJSON layer creation function
  //         const usStateRates = response;
  
  //         // Load GeoJSON data for USA states
  //         fetch("https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json")
  //             .then(response => response.json())
  //             .then(usGeoJSON => {
  //               function getColor(rate) {
  //                 // Define color range based on Rate value
  //                 return rate >= 170 ? '#800026' :
  //                        rate >= 160 ? '#BD0026' :
  //                        rate >= 150 ? '#E31A1C' :
  //                        rate >= 140 ? '#FC4E2A' :
  //                        rate >= 130 ? '#FD8D3C' :
  //                                      '#FEB24C';
  //             }
  //                 // Create a Leaflet GeoJSON layer for USA states
  //                 L.geoJSON(usGeoJSON, {
  //                     style: function (feature) {
  //                         // Get state code from feature properties
  //                         const stateCode = feature.properties.state_code;
  //                         // Find the entry with matching state code
  //                         const stateEntry = usStateRates.find(entry => entry.STATE === stateCode);
  //                         // If state entry found, parse rate value and set fillColor accordingly
  //                         if (stateEntry) {
  //                             const rate = parseFloat(stateEntry.RATE);
  //                             return {
  //                                 fillColor: getColor(rate),
  //                                 weight: 2,
  //                                 opacity: 1,
  //                                 color: 'white',
  //                                 dashArray: '3',
  //                                 fillOpacity: 0.7
  //                             };
  //                         } else {
  //                             // If no matching entry found, use default style
  //                             return {
  //                                 fillColor: 'gray',
  //                                 weight: 2,
  //                                 opacity: 1,
  //                                 color: 'white',
  //                                 dashArray: '3',
  //                                 fillOpacity: 0.7
  //                             };
  //                         }
  //                     }
  //                 }).addTo(map); // Add GeoJSON layer to the map
  //             })
  //             .catch(error => console.error('Error loading USA GeoJSON:', error));
  //     })
  //     .catch(error => console.error('Error fetching JSON from Flask:', error));
  
  // Function to determine color based on Rate value
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lung Trend chart
fetch('/Northamericalung')
    .then(response => response.json())
    .then(data => {
        // Preprocess the data to group values by year and take the average
        const processedData = {};
        data.forEach(entry => {
            const year = entry.Category;
            if (!processedData[year]) {
                processedData[year] = {
                    'US males': [],
                    'US females': [],
                    'Canada males': [],
                    'Canada females': []
                };
            }
            processedData[year]['US males'].push(entry['US males']);
            processedData[year]['US females'].push(entry['US females']);
            processedData[year]['Canada males'].push(entry['Canada males']);
            processedData[year]['Canada females'].push(entry['Canada females']);
        });

        const categories = Object.keys(processedData);
        const usMales = [];
        const usFemales = [];
        const canadaMales = [];
        const canadaFemales = [];

        // Calculate averages for each year
        categories.forEach(year => {
            usMales.push(average(processedData[year]['US males']));
            usFemales.push(average(processedData[year]['US females']));
            canadaMales.push(average(processedData[year]['Canada males']));
            canadaFemales.push(average(processedData[year]['Canada females']));
        });

        // Create traces for each dataset
        const traces = [
            {
                x: categories,
                y: usMales,
                mode: 'lines',
                name: 'US Males',
                line: {
                    color: 'rgba(255, 99, 132, 1)'
                }
            },
            {
                x: categories,
                y: usFemales,
                mode: 'lines',
                name: 'US Females',
                line: {
                    color: 'rgba(54, 162, 235, 1)'
                }
            },
            {
                x: categories,
                y: canadaMales,
                mode: 'lines',
                name: 'Canada Males',
                line: {
                    color: 'rgba(255, 206, 86, 1)'
                }
            },
            {
                x: categories,
                y: canadaFemales,
                mode: 'lines',
                name: 'Canada Females',
                line: {
                    color: 'rgba(75, 192, 192, 1)'
                }
            }
        ];

        // Define layout
        const layout = {
            title: 'Lung Cancer Trend in North America',
            xaxis: {
                title: 'Year'
            },
            yaxis: {
                title: 'ASR (World) per 100,000'
            }
        };

        // Plot the chart
        Plotly.newPlot('myChart', traces, layout);
    })
    .catch(error => console.error('Error fetching data:', error));

function average(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
}


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