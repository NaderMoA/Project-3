// Fetch the CSV file
fetch("top_ten_deadliest_cancers.csv")
  .then(response => response.text())
  .then(csvData => {
    // Parse the CSV data using Papaparse
    const parsedData = Papa.parse(csvData, { header: true }).data;
    parsedData.sort((a, b) => parseFloat(b['Survival Rate%']) - parseFloat(a['Survival Rate%']));
    // Now 'parsedData' is an array of objects representing each row in the CSV file
    // You can use it to create your Plotly chart or perform any other operations
    
    // For example, you can plot a chart using Plotly
    const x = parsedData.map(row => row['Survival Rate%']);
    const y = parsedData.map(row => row['Deadliest Cancers']);
    const customColors = [
      "#012d36", "#06b6a7", "#ffc215", "#fb9600", "#fe552e", "#6eb8db","#8fe6eb","#c1b7e9","#e993bc","#ff696d"
    ];
//"#6dd3e9", "#f61b67", "#1cb8b4", "#8bd3c7","#d7658b"
    const plotlyData = [{
      x: x,
      y: y,
      type: 'bar',
      orientation: 'h',
      marker: {color: customColors,
        width: 0.6,
      }
    }];

    const layout = {
      title: 'Top Ten Deadliest Cancers and Their Survival Rates',
      xaxis: {
        title: '5 Year Survival Rate (%)'
      },
      yaxis: {
        title: 'Cancer Type'
      },
      height: 400,
      width: 0.6,
      hovermode: 'closest',
    };

    Plotly.newPlot('horizontal_bar_chart', plotlyData, layout);
    // defining click event
    document.getElementById('horizontal_bar_chart').on('plotly_click', function(data) {
      // Get the index of the clicked bar
      const index = data.points[0].pointNumber;

      // Get the cancer type
      const cancerType = parsedData[index]['Deadliest Cancers'];

      // Get the image URL for the cancer type
      const imageUrl = getImageUrl(cancerType);

      // Open a popup or modal with the image
      if (imageUrl) {
        openPopup(imageUrl);
      }
    });

    // Function to get the image URL based on the cancer type
    function getImageUrl(cancerType) {
      const imageUrls = {
        "Pancreatic cancer": 'https://cdn.mos.cms.futurecdn.net/6nZWaqsX5KvF8AB2QTj7NS-650-80.jpg.webp',
        "Mesothelioma": 'https://www.mesotheliomavets.com/app/uploads/2021/10/GettyImages-1088865268-Converted-01-scaled.jpg',
        "Gallbladder cancer": 'https://cdn.mos.cms.futurecdn.net/ZDg6kuMbd6tDPN8nPdVSr5-650-80.jpg.webp',
        "Esophageal cancer": 'https://cdn.mos.cms.futurecdn.net/VeQtbmUPLZusw4EHVH56ER-650-80.jpg.webp',
        "Liver and intrahepatic bile duct cancer": 'https://cdn.mos.cms.futurecdn.net/SZPWm9nQ5NgVq7AtrTwTkJ-650-80.jpg.webp',
        "Lung and bronchial cancer": 'https://cdn.mos.cms.futurecdn.net/ryxnvpAwzSZmC7PA6NsN6L-650-80.jpg.webp',
        "Pleural cancer": 'https://upload.wikimedia.org/wikipedia/commons/0/0d/2313_The_Lung_Pleurea.jpg',
        "Acute monocytic leukemia": 'https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoiaWhoLWhlYWx0aGNhcmUtYmVyaGFkXC9maWxlXC9tMTYyZGZEZ1RocjQ4V0tWajlEei5qcGcifQ:ihh-healthcare-berhad:oUXLo02sDB-J7aqLBgNtOWCg8clfGj5HKv0JCCzc6Rw?width=%7Bwidth%7D',
        "Brain cancer": 'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/newscms/2017_15/1336291/151211-brain-intelligence-mn-1045.jpg',
        "Acute myeloid leukemia": 'https://nci-media.cancer.gov/pdq/media/images/755927.jpg'
      };
      return imageUrls[cancerType];
    }

    // Function to open a popup or modal with the image
    function openPopup(imageUrl) {
      // You can implement logic to display the image in a popup or modal
      // For demonstration purposes, you could use the window.open method to open the image in a new tab
      window.open(imageUrl);
    }
  })
  .catch(error => console.error('Error fetching CSV:', error));