document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('countrySelect');
    const predictionChartContainer = document.getElementById('predictionChart');
    const historicChartContainer = document.getElementById('historicChart');

    // Function to fetch and display forecast chart data for the selected country
    function displayForecastChart(country) {
        // Construct the URLs for fetching data based on the selected country
        const maleUrl = `/prediction${country}_forecast`;
        const femaleUrl = `/predictionf_${country}_forecast`;
    
        // Fetch data for male forecast
        fetch(maleUrl)
            .then(response => response.json())
            .then(maleData => {
                let male_ds = maleData.map(item => new Date(item.ds).getFullYear());
                let male_yhat = maleData.map(item => parseFloat(item.yhat).toFixed(2)); // Round to 2 decimal places
    
                // Combine male_ds and male_yhat into an array of objects for sorting
                let maleDataCombined = male_ds.map((year, index) => ({ year, value: male_yhat[index] }));
    
                // Sort the array based on the year
                maleDataCombined.sort((a, b) => a.year - b.year);
    
                // Separate the sorted data back into male_ds and male_yhat arrays
                male_ds = maleDataCombined.map(item => item.year);
                male_yhat = maleDataCombined.map(item => item.value);
    
                // Fetch data for female forecast
                fetch(femaleUrl)
                    .then(response => response.json())
                    .then(femaleData => {
                        let female_ds = femaleData.map(item => new Date(item.ds).getFullYear());
                        let female_yhat = femaleData.map(item => parseFloat(item.yhat).toFixed(2)); // Round to 2 decimal places
    
                        // Combine female_ds and female_yhat into an array of objects for sorting
                        let femaleDataCombined = female_ds.map((year, index) => ({ year, value: female_yhat[index] }));
    
                        // Sort the array based on the year
                        femaleDataCombined.sort((a, b) => a.year - b.year);
    
                        // Separate the sorted data back into female_ds and female_yhat arrays
                        female_ds = femaleDataCombined.map(item => item.year);
                        female_yhat = femaleDataCombined.map(item => item.value);
    
                        // Initialize Highcharts chart
                        Highcharts.chart(predictionChartContainer, {
                            chart: {
                                type: 'line'
                            },
                            title: {
                                text: `Predicted Lung Cancer Death Rates for ${formatCountry(country)}`
                            },
                            xAxis: {
                                categories: male_ds.map(String), // Convert years to strings
                                title: {
                                    text: 'Year'
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Prediction Death Rate (per 100k)'
                                }
                            },
                            series: [{
                                name: `${formatCountry(country)} Male`,
                                data: male_yhat.map(parseFloat), // Convert data points to floats
                                color: '#5F9595'
                            }, {
                                name: `${formatCountry(country)} Female`,
                                data: female_yhat.map(parseFloat), // Convert data points to floats
                                color: '#F0BC68'
                            }]
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching female data:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching male data:', error);
            });
    }

    // Function to fetch and display historic chart data for the selected country
    function displayHistoricChart(country) {
        // Construct the URL for fetching historic data based on the selected country
        const historicUrl = `/prediction${country}_historic`;

        // Fetch historic data for the selected country
        fetch(historicUrl)
            .then(response => response.json())
            .then(historicData => {
                // Convert fetched data into a format compatible with Highcharts
                const chartData = historicData.map(row => {
                    const year = new Date(row.Year, 0, 1).getTime(); // Convert year to milliseconds
                    return [year, parseFloat(row['age-standardized_death_rate_per_100k_male']), parseFloat(row['age-standardized_death_rate_per_100k_female'])];
                });

                // Sort data by year
                chartData.sort((a, b) => a[0] - b[0]);

                // Draw the historic line chart using Highcharts
                Highcharts.chart(historicChartContainer, {
                    chart: {
                        type: 'line'
                    },
                    title: {
                        text: `Historic Lung Cancer Death Rates for ${formatCountry(country)}`
                    },
                    xAxis: {
                        type: 'datetime',
                        title: {
                            text: 'Year'
                        },
                        labels: {
                            formatter: function () {
                                return Highcharts.dateFormat('%Y', this.value); // Format tooltip to show only the year
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Death Rate (per 100k)'
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            return `<b>${Highcharts.dateFormat('%Y', this.x)}</b><br/>${this.series.name}: ${this.y}`;
                        }
                    },
                    series: [{
                        name: `${formatCountry(country)} Male`,
                        data: chartData.map(row => [row[0], row[1]]), // Extract male death rates
                        color: '#2573a1'
                    }, {
                        name: `${formatCountry(country)} Female`,
                        data: chartData.map(row => [row[0], row[2]]), // Extract female death rates
                        color: '#ff683b'
                    }]
                });
            })
            .catch(error => {
                console.error('Error fetching historic data:', error);
            });
    }

    // Event listener for the country selection dropdown
    countrySelect.addEventListener('change', function() {
        const selectedCountry = this.value;
        displayHistoricChart(selectedCountry);
        displayForecastChart(selectedCountry);
    });

    // Initial display of both charts for the default selected country
    const defaultCountry = countrySelect.value;
    displayForecastChart(defaultCountry);
    displayHistoricChart(defaultCountry);

    // Function to format country names with the first letter of each word capitalized
    function formatCountry(country) {
        return country.charAt(0).toUpperCase() + country.slice(1);
    }
});



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