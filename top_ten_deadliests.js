// Fetch the CSV file
fetch("Resources/EU/top_ten_deadliest_cancers.csv")
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
    "#012d36", "#06b6a7", "#ffc215", "#fb9600", "#db1048", "#fe6974","#6eb8db","#8fe6eb","#ff8bbe","#febecf"
  ];

  const plotlyData = [{
    x: x,
    y: y,
    type: 'bar',
    orientation: 'h',
    marker: {
      color: customColors,
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
      "Mesothelioma": 'https://blogs.bcm.edu/wp-content/uploads/2019/09/Lungs-673804650.jpg',
      "Gallbladder cancer": 'https://cdn.mos.cms.futurecdn.net/ZDg6kuMbd6tDPN8nPdVSr5-650-80.jpg.webp',
      "Esophageal cancer": 'https://t3.ftcdn.net/jpg/05/75/74/50/360_F_575745096_3hmXuAisn1ll6jREVvZ8qQpYWM3KDmYC.jpg',
      "Liver and intrahepatic bile duct cancer": 'https://cdn.mos.cms.futurecdn.net/SZPWm9nQ5NgVq7AtrTwTkJ-650-80.jpg.webp',
      "Lung and bronchial cancer": 'https://st.depositphotos.com/1265046/1328/i/450/depositphotos_13281363-stock-photo-human-thorax-organs-with-lungs.jpg',
      "Pleural cancer": 'https://media.istockphoto.com/id/496266075/photo/lungs-male-anatomy-posterior-x-ray-view.jpg?s=612x612&w=0&k=20&c=B0eRxXBmOAT2XwMNtZOG1G6RtDCtzB5qKKo3RSsHkzY=',
      "Acute monocytic leukemia": 'https://img.freepik.com/premium-photo/monocyte-left-lymphocyte-right-surrounded-by-red-blood-cells-3d-illustration_938508-5305.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1702857600&semt=sph',
      "Brain cancer": 'https://www.thestatesman.com/wp-content/uploads/2022/06/brain-1.jpg',
      "Acute myeloid leukemia": 'https://media.istockphoto.com/id/685452836/video/femur.jpg?s=640x640&k=20&c=IJOyK56KwW9sYTehX-PkT1r35PI6jBaUK8azYPsZiIc='
    };
    return imageUrls[cancerType];
  }

  // Function to open a popup or modal with the image
  function openPopup(imageUrl) {
    // Create a popup or modal element
    const popup = document.createElement('div');
    popup.classList.add('popup');

    // Create an image element to display the image
    const image = document.createElement('img');
    image.src = imageUrl;

    // Append the image to the popup
    popup.appendChild(image);

    // Append the popup to the document body
    document.body.appendChild(popup);

    // Add event listener to close the popup when clicked outside the image
    popup.addEventListener('click', function(event) {
      if (event.target === popup) {
        popup.remove();
      }
    });
  }
})
.catch(error => console.error('Error fetching CSV:', error));