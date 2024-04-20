// creating Argentina chart
document.addEventListener('DOMContentLoaded', function() {
    d3.json('/predictionargentina_forecast').then(function(data) {
        const ds = data.map(item => item.ds);
        const yhat = data.map(item => item.yhat);

        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#predictionChart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(ds)
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(yhat)])
            .range([height, 0]);

        const line = d3.line()
            .x((d, i) => x(ds[i]) + x.bandwidth() / 2)
            .y(d => y(d));

        svg.append("path")
            .datum(yhat)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .call(d3.axisLeft(y));
    });
});
