fetch("/Cancertop") // Update the route to your Flask endpoint
.then(response => response.json())
.then(jsonData => {
  // Sort the data by survival rate in ascending order
  jsonData.sort((a, b) => b['Survival Rate'] - a['Survival Rate']);

  // Extracting keys and values from jsonData
  const deadliestCancers = jsonData.map(entry => entry['Deadliest Cancers']);
  const survivalRates = jsonData.map(entry => entry['Survival Rate']); // Update column name without "%"

  // Ensure "Brain cancer" is included in the deadliestCancers array
  if (!deadliestCancers.includes("Brain cancer")) {
    deadliestCancers.push("Brain cancer");
    survivalRates.push(0); // Add a dummy value for Brain cancer
  }

  // Custom pastel colors
  const customColors = ['#e5526f', '#A3D9CF', '#D9BCF2', '#72DBF2', '#efcb6d', '#A0B392','#71B1D9', '#F2C4C4', '#F2A477', '#A9B5D9'];

  // Create plotly data
  const plotlyData = [{
    x: survivalRates.map(rate => 0), // Initial values set to 0 for animation
    y: deadliestCancers,
    type: 'bar',
    orientation: 'h',
    marker: {
      color: customColors,
      width: 0.6,
    }
  }];

  const layout = {
    title: 'Top Ten Deadliest Cancers With The Lowest Survival Rates',
    xaxis: {
      title: '5 Year Survival Rate (%)',
      range: [0, 35] // Set the range of x-axis to 0-100
    },
    yaxis: {
      title: 'Cancer Type',
      automargin: true, // Adjust the margin automatically
      margin: { // Set specific margin values if needed
        l: 150 // Left margin in pixels
      },
      titlefont: {
        size: 16, // Adjust the font size of the y-axis title
        color: 'black', // Set the color of the y-axis title
        // Adjust the margin between the title and the axis
        margin: { 
          b: 20 // Bottom margin in pixels
        }
      }
    },
    height: 400,
    width: 800, // Adjust width as needed
    hovermode: 'closest',
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  // Plot the chart
  Plotly.newPlot('horizontal_bar_chart', plotlyData, layout, config);

  // Animate the chart
  const animationFrames = 100; // Number of animation frames
  const animationDuration = 2700; // Animation duration in milliseconds
  const delayBetweenFrames = animationDuration / animationFrames;

  for (let i = 1; i <= animationFrames; i++) {
    setTimeout(() => {
      const updatedData = [{ x: survivalRates.map((rate, index) => rate * (i / animationFrames)) }];
      Plotly.restyle('horizontal_bar_chart', 'x', [updatedData[0].x]);
    }, i * delayBetweenFrames);
  }

  // defining click event
  document.getElementById('horizontal_bar_chart').on('plotly_click', function(data) {
    // Get the index of the clicked bar
    const index = data.points[0].pointNumber;
  
    // Get the cancer type
    const cancerType = deadliestCancers[index];
  
    // Get the image URL for the cancer type
    const imageUrl = getImageUrl(cancerType);
  
    // Define the specific text for the image
    let specificText;
    switch (cancerType) {
      case "Pancreatic cancer":
        specificText = "Digestive system cancers in general are quite deadly, with fewer than half of patients surviving five years, and pancreatic cancer is the deadliest of the bunch. ";
        break;
      case "Mesothelioma":
        specificText = "Three out of four mesotheliomas develop in the mesothelium that surrounds the lungs  ";
        break;
      case "Gallbladder cancer":
        specificText = "Gallstones significantly increase the risk of developing gallbladder cancer."
        break;  
        case "Esophageal cancer":
          specificText = "Risk factors for esophageal cancer include older age, being male, smoking, drinking alcohol and having acid reflux"
          break; 
          case "Liver and intrahepatic bile duct cancer":
            specificText = "Liver cancer is one of the most common forms of cancer worldwide"
            break; 
            case "Lung and bronchial cancer":
              specificText = "Lung and bronchial cancer kill the most people worldwide every year."
              break;
            case "Pleural cancer":
              specificText = "Pleural cancer occurs in the pleural cavity, the space within the chest cavity but outside the lungs, or in the layer of cells that surrounds the lungs."
              break; 
            case "Acute monocytic leukemia":
              specificText = "It develops in blood precursor cells that are on their way to becoming immune-system cells called monocytes"
              break;
            case "Acute myeloid leukemia":
              specificText = "Leukemias develop from stem cells in the bone marrow"
              break;  
            case "Brain cancer":
              specificText = "In adults, brain tumors rarely begin in the brain. More often, they spread there from other cancers"
              break;                                                                                    
      // Add more cases for other cancer types as needed
      default:
        specificText = "This image represents " + cancerType + ".";
    }
  
    // Open a popup or modal with the image and specific text
    if (imageUrl) {
      openPopup(imageUrl, specificText);
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
  function openPopup(imageUrl, text) {
    // Create a popup or modal element
    const popup = document.createElement('div');
    popup.classList.add('popup');
  
    // Create an image element to display the image
    const image = document.createElement('img');
    image.src = imageUrl;
  
    // Create paragraphs for each line of text
    const paragraphs = text.split('\n').map(line => {
      const paragraph = document.createElement('p');
      paragraph.textContent = line;
      return paragraph;
    });
  
    // Add a class to the popup for styling
    //popup.classList.add('custom-popup');
  
    // Append the image and paragraphs to the popup
    popup.appendChild(image);
    paragraphs.forEach(paragraph => popup.appendChild(paragraph));
  
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
.catch(error => console.error('Error fetching JSON:', error));


// Get the current URL path
const currentPath = window.location.pathname;

// Get all the buttons in the header
const buttons = document.querySelectorAll('.header .btn');

// Loop through each button to check if its href matches the current path
buttons.forEach(button => {
  if (button.getAttribute('href') === currentPath) {
    // Add the 'active' class to the button if it matches the current path
    button.classList.add('active');
  }
});