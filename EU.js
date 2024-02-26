// Fetch data for the first donut chart (1.9M DEATHS)
fetch("EU_death_rate.csv")
  .then(response => response.text())
  .then(csvData => {
    const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true }).data;
    const filteredData = parsedData.filter(row => row['1.9M DEATHS'] !== undefined && row['1.9M DEATHS'] !== null && row['1.9M DEATHS'] !== 0);
    const values1 = filteredData.map(row => parseFloat(row['1.9M DEATHS']));
    const labels1 = filteredData.map(row => row['Category']);
    const customColors1 = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'];
    const width1 = 700;
    const height1 = 500;
    const radius1 = Math.min(width1, height1) / 3;
    const arcPadding1 = 0.01;
    const totalDeaths1 = (values1.reduce((a, b) => a + b, 0) * 10 ** -6).toFixed(1);
    let arc1 = d3.arc()
      .innerRadius(radius1 * 0.6)
      .outerRadius(radius1)
      .cornerRadius(5)
      .padAngle(arcPadding1);
    const pie1 = d3.pie()
      .sort(null)
      .value(d => d);
    const svg1 = d3.select("#donut_chart1")
      .append("svg")
      .attr("width", width1)
      .attr("height", height1)
      .append("g")
      .attr("transform", `translate(${width1 / 2},${height1 / 2})`);
    const g1 = svg1.selectAll(".arc")
      .data(pie1(values1))
      .enter().append("g")
      .attr("class", "arc");
    g1.append("path")
      .attr("d", arc1)
      .style("fill", (_, i) => customColors1[i])
      .on("mouseover", function (event, d) {
        d3.select(this).style("filter", "url(#drop-shadow1)");
        d3.select(this).style("opacity", "0.7");
        labelGroup1.style("opacity", (_, i) => i === d.index ? 1 : 0);
        legend1.filter((_, i) => i === d.index)
          .select("text")
          .style("font-weight", "bold");
      })
      .on("mouseout", function () {
        d3.select(this).style("filter", "none");
        d3.select(this).style("opacity", "1");
        labelGroup1.style("opacity", 0);
        legend1.selectAll("text")
          .style("font-weight", "normal");
      });
    svg1.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text(`${totalDeaths1}M DEATHS`)
      .style("font-size", "20px")
      .style("fill", "black");
    const labelGroup1 = svg1.append("g").attr("class", "labels").selectAll("text")
      .data(pie1(values1))
      .enter()
      .append("text")
      .style("opacity", 0)
      .attr("transform", d => `translate(${arc1.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d, i) => `${labels1[i]}: ${(100 * values1[i] / values1.reduce((a, b) => a + b, 0)).toFixed(1)}%`)
      .style("font-size", "12px")
      .style("fill", "black");
    g1.on("mouseover", function (event, d) {
      labelGroup1.style("opacity", (_, i) => i === d.index ? 1 : 0);
      g1.style("opacity", (_, i) => i === d.index ? 0.7 : 0.3);
    }).on("mouseout", function () {
      labelGroup1.style("opacity", 0);
      g1.style("opacity", 1);
    });
    const defs1 = svg1.append("defs");
    const filter1 = defs1.append("filter")
      .attr("id", "drop-shadow1")
      .attr("height", "130%");
    filter1.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 10)
      .attr("result", "blur");
    filter1.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 3)
      .attr("dy", 3)
      .attr("result", "offsetBlur");
    const feMerge1 = filter1.append("feMerge");
    feMerge1.append("feMergeNode").attr("in", "offsetBlur");
    feMerge1.append("feMergeNode").attr("in", "SourceGraphic");

    // Add legend for the first chart
    const legend1 = svg1.selectAll(".legend1")
      .data(labels1)
      .enter()
      .append("g")
      .attr("class", "legend1")
      .attr("transform", (d, i) => `translate(200,${i * 20})`);

    legend1.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d, i) => customColors1[i]);

    legend1.append("text")
      .text(d => d)
      .style("font-size", 12)
      .attr("y", 10)
      .attr("x", 11);
  })
  .catch(error => console.error('Error fetching CSV:', error));

// Fetch data for the second donut chart (3.9M CASES)
fetch("EU_death_rate.csv")
  .then(response => response.text())
  .then(csvData => {
    const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true }).data;
    const filteredData = parsedData.filter(row => row['Category'] !== undefined && row['3.9M CASES'] !== undefined && row['3.9M CASES'] !== null && row['3.9M CASES'] !== 0);
    const values2 = filteredData.map(row => parseFloat(row['3.9M CASES']));
    const labels2 = filteredData.map(row => row['Category']);
    const customColors2 = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'];
    const width2 = 700;
    const height2 = 500;
    const radius2 = Math.min(width2, height2) / 3;
    const arcPadding2 = 0.01;
    const totalCases2 = (values2.reduce((a, b) => a + b, 0) * 10 ** -6).toFixed(1);
    let arc2 = d3.arc()
      .innerRadius(radius2 * 0.6)
      .outerRadius(radius2)
      .cornerRadius(5)
      .padAngle(arcPadding2);
    const pie2 = d3.pie()
      .sort(null)
      .value(d => d);
    const svg2 = d3.select("#donut_chart2")
      .append("svg")
      .attr("width", width2)
      .attr("height", height2)
      .append("g")
      .attr("transform", `translate(${width2 / 2},${height2 / 2})`);
    const g2 = svg2.selectAll(".arc")
      .data(pie2(values2))
      .enter().append("g")
      .attr("class", "arc");
    g2.append("path")
      .attr("d", arc2)
      .style("fill", (_, i) => customColors2[i])
      .on("mouseover", function (event, d) {
        d3.select(this).style("filter", "url(#drop-shadow2)");
        d3.select(this).style("opacity", "0.7");
        labelGroup2.style("opacity", (_, i) => i === d.index ? 1 : 0);
        legend2.filter((_, i) => i === d.index)
          .select("text")
          .style("font-weight", "bold");
      })
      .on("mouseout", function () {
        d3.select(this).style("filter", "none");
        d3.select(this).style("opacity", "1");
        labelGroup2.style("opacity", 0);
        legend2.selectAll("text")
          .style("font-weight", "normal");
      });
    svg2.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text(`${totalCases2}M CASES`)
      .style("font-size", "20px")
      .style("fill", "black");
    const labelGroup2 = svg2.append("g").attr("class", "labels").selectAll("text")
      .data(pie2(values2))
      .enter()
      .append("text")
      .style("opacity", 0)
      .attr("transform", d => `translate(${arc2.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d, i) => `${labels2[i]}: ${(100 * values2[i] / values2.reduce((a, b) => a + b, 0)).toFixed(1)}%`)
      .style("font-size", "12px")
      .style("fill", "black");
    g2.on("mouseover", function (event, d) {
      labelGroup2.style("opacity", (_, i) => i === d.index ? 1 : 0);
      g2.style("opacity", (_, i) => i === d.index ? 0.7 : 0.3);
    }).on("mouseout", function () {
      labelGroup2.style("opacity", 0);
      g2.style("opacity", 1);
    });
    const defs2 = svg2.append("defs");
    const filter2 = defs2.append("filter")
      .attr("id", "drop-shadow2")
      .attr("height", "130%");
    filter2.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 10)
      .attr("result", "blur");
    filter2.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 3)
      .attr("dy", 3)
      .attr("result", "offsetBlur");
    const feMerge2 = filter2.append("feMerge");
    feMerge2.append("feMergeNode").attr("in", "offsetBlur");
    feMerge2.append("feMergeNode").attr("in", "SourceGraphic");

    // Add legend for the second chart
    const legend2 = svg2.selectAll(".legend2")
      .data(labels2)
      .enter()
      .append("g")
      .attr("class", "legend2")
      .attr("transform", (d, i) => `translate(200,${i * 20})`);

    legend2.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d, i) => customColors2[i]);

    legend2.append("text")
      .text(d => d)
      .style("font-size", 12)
      .attr("y", 10)
      .attr("x", 11);
  })
  .catch(error => console.error('Error fetching CSV:', error));