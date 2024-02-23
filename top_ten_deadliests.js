
  const x = [1, 2, 3, 4, 5];
const y = [10, 20, 30, 40, 50];

const plotlyData = [{
  x: x,
  y: y,
  type: 'bar',
  orientation: 'h'
}];

const layout = {
  title: 'Test Chart',
  xaxis: {
    title: 'X Axis'
  },
  yaxis: {
    title: 'Y Axis'
  }
};

Plotly.newPlot("horizontal-bar-chart", plotlyData, layout);