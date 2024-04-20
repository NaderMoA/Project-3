document.addEventListener('DOMContentLoaded', function() {
    // Fetch data for argentina_forecast
    fetch('/predictionargentina_forecast')
        .then(response => response.json())
        .then(data => {
            const argentina_ds = data.map(item => new Date(item.ds).getFullYear());
            const argentina_yhat = data.map(item => item.yhat);

            // Fetch data for f_argentina_forecast
            fetch('/prediction/f_argentina_forecast')
                .then(response => response.json())
                .then(f_data => {
                    const f_argentina_ds = f_data.map(item => new Date(item.ds).getFullYear());
                    const f_argentina_yhat = f_data.map(item => item.yhat);

                    // Chart.js configuration
                    const ctx = document.getElementById('predictionChart').getContext('2d');
                    const chart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: argentina_ds,
                            datasets: [
                                {
                                    label: 'Men',
                                    data: argentina_yhat,
                                    borderColor: 'steelblue',
                                    fill: false
                                },
                                {
                                    label: 'Women',
                                    data: f_argentina_yhat,
                                    borderColor: 'orange',
                                    fill: false
                                }
                            ]
                        },
                        options: {
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Lung Cancer Death Rate', // Title for the entire chart
                                    font: {
                                        size: 18
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Year'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Prediction'
                                    }
                                }
                            }
                        }
                    });
                });
        });
});