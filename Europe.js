// Function to fetch data from Flask endpoint and visualize it
function fetchDataAndVisualize() {
    fetch("/Europe") // Fetch data from Flask endpoint
      .then(response => response.json())
      console.log(response) // Parse JSON response
      .then(data => {
        // Your data visualization logic here
        const parsedData = data; // Assuming your JSON data has the same structure as your CSV data
  
        // Example data manipulation
        const filteredData = parsedData.filter(row => row['1.9M DEATHS'] !== undefined && row['1.9M DEATHS'] !== null);
        const values = filteredData.map(row => parseFloat(row['1.9M DEATHS']));
        const labels = filteredData.map(row => row['Category']);
        const data = values.map((value, index) => ({ value, label: labels[index] }));
        data.sort((a, b) => b.value - a.value);
        const sortedValues = data.map(item => item.value);
        const sortedLabels = data.map(item => item.label);
        
        // Proceed with your data visualization logic using sortedValues and sortedLabels
        // Example: update chart, legend, tooltips, etc.
        console.log(data); // Check the structure of the data received
      })
      .catch(error => console.error('Error fetching data from Flask:', error));
  }
  
  // Call the function to fetch data and visualize it
  fetchDataAndVisualize();