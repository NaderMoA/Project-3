fetch("EU_death_rate.csv")
  .then(response => response.text())
  .then(csvData => {
    const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true }).data;
    const filteredData = parsedData.filter(row => row['1.9M DEATHS'] !== undefined && row['1.9M DEATHS'] !== null);
    const values = filteredData.map(row => parseFloat(row['1.9M DEATHS']));
    const labels = filteredData.map(row => row['Category']);
    
    // Combine values and labels into objects for sorting
    const data = values.map((value, index) => ({ value, label: labels[index] }));
    
    // Sort the data by value in descending order
    data.sort((a, b) => b.value - a.value);
    
    // Extract sorted values and labels
    const sortedValues = data.map(item => item.value);
    const sortedLabels = data.map(item => item.label);

    const customColors = ['#e5526f',
    '#f4d650',
    '#acddbf',
    '#ff683b',
    '#2f3f58',
    '#af96cf',
    '#c50604',
    '#2573a1'];
    const width = 700; // Increased width to accommodate the legend
    const height = 500;
    const radius = Math.min(width, height) / 3;
    const arcPadding = 0.01;
    // Calculate total value
    const totalDeaths = (sortedValues.reduce((a, b) => a + b, 0) * 10 ** -6).toFixed(1);
    // Add padding
    let arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .cornerRadius(5)
      .padAngle(arcPadding);

    const pie = d3.pie()
      .sort(null)
      .value(d => d);

    const svg = d3.select("#donut_chart2")
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
        // Apply shadow effect on mouseover
        d3.select(this).style("filter", "url(#drop-shadow)");
        // Make legend item bold on mouseover
        legend.filter((_, i) => i === d.index)
          .select("text")
          .style("font-weight", "bold");
      })
      .on("mouseout", function () {
        // Remove shadow effect on mouseout
        d3.select(this).style("filter", "none");
        // Reset legend item style on mouseout
        legend.selectAll("text")
          .style("font-weight", "normal");
      });

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text(`${totalDeaths}M DEATHS`)
      .style("font-size", "20px")
      .style("fill", "black");

    // Add labels
    const labelGroup = svg.append("g").attr("class", "labels").selectAll("text")
      .data(pie(sortedValues))
      .enter()
      .append("text")
      .style("opacity", 0) // initially hide the labels
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d, i) => `${sortedLabels[i]}: ${(100 * sortedValues[i] / sortedValues.reduce((a, b) => a + b, 0)).toFixed(1)}%`)
      .style("font-size", "12px")
      .style("fill", "black");

    // Add event listeners for mouseover and mouseout
    g.on("mouseover", function (event, d) {
      // Show labels on mouseover
      labelGroup.style("opacity", (_, i) => i === d.index ? 1 : 0);
      // Make other arcs pale
      g.style("opacity", (_, i) => i === d.index ? 1 : 0.3);
      // Make legend item bold on mouseover
      legend.filter((_, i) => i === d.index)
        .select("text")
        .style("font-weight", "bold");
    }).on("mouseout", function () {
      // Hide labels and revert opacity on mouseout
      labelGroup.style("opacity", 0);
      g.style("opacity", 1);
      // Reset legend item style on mouseout
      legend.selectAll("text")
        .style("font-weight", "normal");
    });

    // Define the filter for the shadow effect
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

// anothor donut chart
fetch("EU_death_rate.csv")
  .then(response => response.text())
  .then(csvData => {
    const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true }).data;
    
    // Filter out rows with undefined or null values in 'Category' and '3.9M CASES' columns
    const filteredData = parsedData.filter(row => row['Category'] !== undefined && row['3.9M CASES'] !== undefined && row['3.9M CASES'] !== null && row['3.9M CASES'] !== 0);
    
    // Combine values and labels into objects for sorting
    const data = filteredData.map(row => ({ value: parseFloat(row['3.9M CASES']), label: row['Category'] }));
    
    // Sort the data by value in descending order
    data.sort((a, b) => b.value - a.value);
    
    // Extract sorted values and labels
    const sortedValues = data.map(item => item.value);
    const sortedLabels = data.map(item => item.label);

    // Define custom colors for the chart
    const customColors = ['#22b1b9', '#ccaeea', '#efcb6d', '#036264','#38a2ff', '#f77b1c', '#567e99', '#ffc215'];

    // Define dimensions for the chart
    const width = 700;
    const height = 500;
    const radius = Math.min(width, height) / 3;
    const arcPadding = 0.01;

    // Calculate total value
    const totalCases = (sortedValues.reduce((a, b) => a + b, 0) * 10 ** -6).toFixed(1);

    // Define arc generator
    let arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .cornerRadius(5)
      .padAngle(arcPadding);

    // Define pie generator
    const pie = d3.pie()
      .sort(null)
      .value(d => d);

    // Create SVG element
    const svg = d3.select("#donut_chart1")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create arcs
    const g = svg.selectAll(".arc")
      .data(pie(sortedValues))
      .enter().append("g")
      .attr("class", "arc");

    // Append path elements for each arc
    g.append("path")
      .attr("d", arc)
      .style("fill", (_, i) => customColors[i])
      .on("mouseover", function (event, d) {
        // Apply shadow effect on mouseover
        d3.select(this).style("filter", "url(#drop-shadow)");
        // Make legend item bold on mouseover
        legend.filter((_, i) => i === d.index)
          .select("text")
          .style("font-weight", "bold");
      })
      .on("mouseout", function () {
        // Remove shadow effect on mouseout
        d3.select(this).style("filter", "none");
        // Reset legend item style on mouseout
        legend.selectAll("text")
          .style("font-weight", "normal");
      });

    // Add total cases text
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text(`${totalCases}M CASES`)
      .style("font-size", "20px")
      .style("fill", "black");

    // Add labels
    const labelGroup = svg.append("g").attr("class", "labels").selectAll("text")
      .data(pie(sortedValues))
      .enter()
      .append("text")
      .style("opacity", 0) // initially hide the labels
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d, i) => `${sortedLabels[i]}: ${(100 * sortedValues[i] / sortedValues.reduce((a, b) => a + b, 0)).toFixed(1)}%`)
      .style("font-size", "12px")
      .style("fill", "black");

    // Add event listeners for mouseover and mouseout
    g.on("mouseover", function (event, d) {
      // Show labels on mouseover
      labelGroup.style("opacity", (_, i) => i === d.index ? 1 : 0);
      // Make other arcs pale
      g.style("opacity", (_, i) => i === d.index ? 1 : 0.3);
      // Make legend item bold on mouseover
      legend.filter((_, i) => i === d.index)
        .select("text")
        .style("font-weight", "bold");
    }).on("mouseout", function () {
      // Hide labels and revert opacity on mouseout
      labelGroup.style("opacity", 0);
      g.style("opacity", 1);
      // Reset legend item style on mouseout
      legend.selectAll("text")
        .style("font-weight", "normal");
    });

    // Define the filter for the shadow effect
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