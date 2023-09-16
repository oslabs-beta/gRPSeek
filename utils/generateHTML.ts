import fs from 'fs';

export const generateHTML = (
  latencyData: Array<{ requestNumber: number; latency: number }>
) => {
  const requestNumbers = latencyData.map((item) => item.requestNumber);
  const latencies = latencyData.map((item) => item.latency);

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Time-Series Dashboard</title>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  </head>
  <body>
    <div class="dashboard">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Time-Series Dashboard</h1>
      </div>
      <div class="plot-container">
        <div id="latency-over-time"></div>
        <div id="latency-distribution"></div>
        <div id="latency-summary"></div>
        <div id="latency-scatter-plot"></div>
      </div>
    </div>
    <script>
      const requestNumbers = ${JSON.stringify(requestNumbers)};
      const latencies = ${JSON.stringify(latencies)};

      Plotly.newPlot('latency-over-time', [{
        x: requestNumbers,
        y: latencies,
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'blue', size: 8 },
        line: { color: 'blue', width: 2, shape: 'spline' },
      }], {
        title: 'Latency Over Time',
        xaxis: { title: 'Request Number', showgrid: false, zeroline: false },
        yaxis: { title: 'Latency', showline: false },
        hovermode: 'closest',
        plot_bgcolor: '#f3f3f3',
      });

      Plotly.newPlot('latency-distribution', [{
        x: latencies,
        type: 'histogram',
        marker: { color: 'green' },
      }], {
        title: 'Latency Distribution',
        xaxis: { title: 'Latency', showgrid: false, zeroline: false },
        yaxis: { title: 'Frequency', showline: false },
        barmode: 'overlay',
        bargap: 0.05,
        plot_bgcolor: '#f3f3f3',
      });

      Plotly.newPlot('latency-summary', [{
        y: latencies,
        type: 'box',
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.8,
      }], {
        title: 'Latency Summary',
        yaxis: { title: 'Latency', showline: false },
        plot_bgcolor: '#f3f3f3',
      });

      Plotly.newPlot('latency-scatter-plot', [{
        x: requestNumbers,
        y: latencies,
        mode: 'markers',
        type: 'scatter',
      }], {
        title: 'Latency Scatter Plot',
        xaxis: { title: 'Number of Requests' },
        yaxis: { title: 'Latency' },
      });
    </script>
  </body>
  </html>
  `;

  fs.writeFileSync('dashboard.html', htmlContent);
  console.log('HTML file has been generated successfully!');
};
