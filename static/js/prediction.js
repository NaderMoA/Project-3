document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('countrySelect');
    const predictionChartContainer = document.getElementById('predictionChart'); // Corrected variable name
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
                const male_ds = maleData.map(item => new Date(item.ds).getFullYear());
                const male_yhat = maleData.map(item => parseFloat(item.yhat).toFixed(2)); // Round to 2 decimal places

                // Fetch data for female forecast
                fetch(femaleUrl)
                    .then(response => response.json())
                    .then(femaleData => {
                        const female_ds = femaleData.map(item => new Date(item.ds).getFullYear());
                        const female_yhat = femaleData.map(item => parseFloat(item.yhat).toFixed(2)); // Round to 2 decimal places

                        // Initialize Highcharts chart
                        Highcharts.chart(predictionChartContainer, { // Use predictionChartContainer here
                            chart: {
                                type: 'line'
                            },
                            title: {
                                text: `Lung Cancer Death Rates Prediction for ${formatCountry(country)}`
                            },
                            xAxis: {
                                categories: male_ds.map(String), // Convert years to strings
                                title: {
                                    text: 'Year'
                                }
                            },
                            yAxis: {
                                title: {
                                    text: 'Prediction'
                                }
                            },
                            series: [{
                                name: `${formatCountry(country)} Male`,
                                data: male_yhat.map(parseFloat), // Convert data points to floats
                                color: 'steelblue'
                            }, {
                                name: `${formatCountry(country)} Female`,
                                data: female_yhat.map(parseFloat), // Convert data points to floats
                                color: 'orange'
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
                // Convert fetched data into a format compatible with Google Charts API
                const chartData = [['Year',  `Historic ${formatCountry(country)} Male`, `Historic ${formatCountry(country)} Femle`]];
                historicData.forEach(row => {
                    const year = new Date(row.Year, 0, 1); // Convert year to a Date object
                    chartData.push([year, parseFloat(row['age-standardized_death_rate_per_100k_male']), parseFloat(row['age-standardized_death_rate_per_100k_female'])]);
                });
    
                // Draw the historic line chart using Google Charts API
                google.charts.load('current', {'packages':['corechart']});
                google.charts.setOnLoadCallback(drawChart);
    
                function drawChart() {
                    var data = google.visualization.arrayToDataTable(chartData);
    
                    var options = {
                        title: `Historic Lung Cancer Death Rates for ${formatCountry(country)}`,
                        curveType: 'function',
                        legend: { position: 'bottom' },
                        hAxis: {
                            format: 'yyyy' // Format the x-axis as 'YYYY'
                        }
                    };
    
                    var chart = new google.visualization.LineChart(historicChartContainer);
                    chart.draw(data, options);
                }
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