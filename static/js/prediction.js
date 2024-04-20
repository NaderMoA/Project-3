document.addEventListener('DOMContentLoaded', function() {
    // Fetch data for Argentina forecast
    fetch('/predictionargentina_forecast')
        .then(response => response.json())
        .then(data => {
            const argentina_ds = data.map(item => new Date(item.ds).getFullYear());
            const argentina_yhat = data.map(item => parseFloat(item.yhat).toFixed(2)); // Round to two decimal places and convert to string

            // Fetch data for female Argentina forecast
            fetch('/predictionf_argentina_forecast')
                .then(response => response.json())
                .then(f_data => {
                    const f_argentina_yhat = f_data.map(item => parseFloat(item.yhat).toFixed(2)); // Round to two decimal places and convert to string

                    // Convert rounded yhat values back to numbers
                    const argentina_yhat_numeric = argentina_yhat.map(parseFloat);
                    const f_argentina_yhat_numeric = f_argentina_yhat.map(parseFloat);

                    // Initialize Highcharts chart
                    Highcharts.chart('predictionChart', {
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: 'Lung Cancer Death Rates Prediction for Argentina'
                        },
                        xAxis: {
                            categories: argentina_ds,
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
                            name: 'Argentina (Male)',
                            data: argentina_yhat_numeric
                        },
                        {
                            name: 'Argentina (Female)',
                            data: f_argentina_yhat_numeric
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
});