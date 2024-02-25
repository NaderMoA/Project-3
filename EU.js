fetch("EU_death_rate.csv")
  .then(response => response.text())
  .then(csvData => {
    const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true }).data;
    const filteredData = parsedData.filter(row => row['1.9M DEATHS'] !== undefined && row['1.9M DEATHS'] !== null);
    const values = filteredData.map(row => parseFloat(row['1.9M DEATHS']));
    const labels = filteredData.map(row => row['Category']);
    const customColors = ['#FFB6C1', '#FFDAB9', '#FFA07A', '#FFD700', '#98FB98', '#ADD8E6', '#FF69B4', '#F0E68C', '#87CEEB', '#FFC0CB'];
    const width = 700; // Increased width to accommodate the legend
    const height = 500;
    const radius = Math.min(width, height) / 3;
    const arcPadding = 0.01;
    // Calculate total value
    const totalDeaths = (values.reduce((a, b) => a + b, 0) * 10 ** -6).toFixed(1);
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
      .data(pie(values))
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
      .data(pie(values))
      .enter()
      .append("text")
      .style("opacity", 0) // initially hide the labels
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d, i) => `${labels[i]}: ${(100 * values[i] / values.reduce((a, b) => a + b, 0)).toFixed(1)}%`)
      .style("font-size", "12px")
      .style("fill", "black");

    // Add event listeners for mouseover and mouseout
    g.on("mouseover", function (event, d) {
      // Show labels on mouseover
      labelGroup.style("opacity", (_, i) => i === d.index ? 1 : 0);
      // Make other arcs pale
      g.style("opacity", (_, i) => i === d.index ? 1 : 0.5);
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
      .attr("stdDeviation", 3)
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
      .data(labels)
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