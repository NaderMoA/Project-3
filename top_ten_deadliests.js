fetch('Resources\top_ten_deadliest_cancers.csv')
  .then(response => response.text())
  .then(csvData => {
    // Parse the CSV data using Papaparse
    const parsedData = Papa.parse(csvData, { header: true }).data;
    
    // Now 'parsedData' is an array of objects representing each row in the CSV file
    // You can use it to create your Plotly chart or perform any other operations
    
    // For example, you can plot a chart using Plotly
    const x = parsedData.map(row => row['Survival Rate']);
    const y = parsedData.map(row => row['Deadliest Cancers']);
    
    const plotlyData = [{
      x: x,
      y: y,
      type: 'bar',
      orientation: 'h'
    }];

    const layout = {
      title: 'Top Ten Deadliest Cancers and Their Survival Rates',
      xaxis: {
        title: 'Survival Rate (%)'
      },
      yaxis: {
        title: 'Cancer Type'
      }
    };

    Plotly.newPlot('chart', plotlyData, layout);
  })
  .catch(error => console.error('Error fetching CSV:', error));