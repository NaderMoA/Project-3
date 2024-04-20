document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('countrySelect');
    const chartContainer = document.getElementById('predictionChart');

    // Function to fetch and display chart data for the selected country
    function displayChart(country) {
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
                        Highcharts.chart(chartContainer, {
                            chart: {
                                type: 'line'
                            },
                            title: {
                                text: `Lung Cancer Death Rates Prediction for ${country}`
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
                                name: 'Male',
                                data: male_yhat.map(parseFloat), // Convert data points to floats
                                color: 'steelblue'
                            }, {
                                name: 'Female',
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

    // Event listener for the country selection dropdown
    countrySelect.addEventListener('change', function() {
        const selectedCountry = this.value;
        displayChart(selectedCountry);
    });

    // Initial display of chart for the default selected country
    const defaultCountry = countrySelect.value;
    displayChart(defaultCountry);
});