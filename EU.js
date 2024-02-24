fetch("EU_death_rate.csv")
  .then(response => response.text())
  .then(csvData => {
    const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true }).data;
    const values = parsedData.map(row => parseFloat(row['1.9M DEATHS'])).filter(value => !isNaN(value));
    const labels = parsedData.map(row => row['Category']).filter(label => label !== undefined);
    const customColors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ffb3e6', '#c2f0c2', '#ff6666', '#c2d6d6', '#c2c2a3'];

    let width = 300;
    let height = 300;
    let radius = Math.min(width, height) / 2;
    let arcPadding = 0.01; // Adjust the arc padding here (in radians)

    // Function to create arcs with rounded edges
    let createArc = function(startAngle, endAngle) {
        return d3.arc()
            .innerRadius(radius * 0.6) // Adjust inner radius for donut chart effect
            .outerRadius(radius)
            .cornerRadius(5) // Adjust corner radius for rounded edges
            .startAngle(startAngle + arcPadding)
            .endAngle(endAngle - arcPadding);
    };

    const pie = d3.pie()
      .sort(null)
      .value(d => d);
    
    const svg = d3.select("#donut_chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const g = svg.selectAll(".arc")
      .data(pie(values))
      .enter().append("g")
      .attr("class", "arc");

    // Create arcs with rounded edges for each data point
    g.append("path")
      .attr("d", d => {
        return createArc(d.startAngle, d.endAngle)();
      })
      .style("fill", (_, i) => customColors[i]);

     svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text("1.9M DEATHS")
      .style("font-size", "20px")
      .style("fill", "black");

  })
  .catch(error => console.error('Error fetching CSV:', error));