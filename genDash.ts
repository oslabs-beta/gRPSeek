import fs from 'fs/promises';
import path from 'path';

/**
 * Generate gRPC Load Test Dashboard
 * @param {Array} cpuData - The CPU usage data.
 * @param {Array} eluData - The Event Loop Utilization data.
 * @returns {String} - The HTML string for the dashboard.

 */
export function generateGrpcLoadTestDashboard(cpuData, eluData) {
  const embeddedDataScript = `
  <script>
    const cpuData = ${JSON.stringify(cpuData)};
    const eluData = ${JSON.stringify(eluData)};
  </script>
  `;
  // HTML structure
  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>gRPC Load Test Dashboard</title>
      <!-- Including Plotly.js CDN -->
      <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  </head>
  <body>
      <h1>gRPC Load Test Metrics Dashboard</h1>
      <!-- CPU Usage Plot -->
      <div id="cpu-usage-plot" style="width: 100%; height: 400px;"></div>
      <!-- Event Loop Utilization Plot -->
      <div id="elu-plot" style="width: 100%; height: 400px;"></div>
      <!-- Combined CPU Usage and Utilization % Plot -->
<div id="combined-plot" style="width: 100%; height: 400px;"></div>

  </body>
  </html>
  `;

  // JavaScript for Plotting
  //   const plotScript = `
  //   <script>
  //       // CPU Usage Plot
  //       const cpuTrace = {
  //           x: cpuData.map((d, i) => i),
  //           y: cpuData.map(d => d.value),
  //           mode: 'lines',
  //           name: 'CPU Usage'
  //       };
  //       const cpuLayout = {
  //           title: 'CPU Usage over Time',
  //           xaxis: {title: 'Time'},
  //           yaxis: {title: 'CPU Usage (%)'}
  //       };
  //       Plotly.newPlot('cpu-usage-plot', [cpuTrace], cpuLayout);

  //       // ELU Plot
  //       const eluTraceActive = {
  //           x: eluData.map((d, i) => i),
  //           y: eluData.map(d => d.value.active),
  //           mode: 'lines',
  //           name: 'Active'
  //       };
  //       const eluTraceIdle = {
  //           x: eluData.map((d, i) => i),
  //           y: eluData.map(d => d.value.idle),
  //           mode: 'lines',
  //           name: 'Idle'
  //       };
  //       const eluTraceUtilization = {
  //           x: eluData.map((d, i) => i),
  //           y: eluData.map(d => d.value.utilization),
  //           mode: 'lines',
  //           name: 'Utilization'
  //       };
  //       const eluLayout = {
  //           title: 'Event Loop Utilization over Time',
  //           xaxis: {title: 'Time'},
  //           yaxis: {title: 'Values'}
  //       };
  //       Plotly.newPlot('elu-plot', [eluTraceActive, eluTraceIdle, eluTraceUtilization], eluLayout);
  //   </script>
  //   `;
  const plotScript = `
<script>
  // CPU Usage Plot
  const cpuTrace = {
      x: cpuData.map((d, i) => i),
      y: cpuData.map(d => d.value),
      mode: 'lines',
      name: 'CPU Usage',
      line: {
        width: 4 // Increase the line width to make it thicker
    }
  };
  const cpuLayout = {
      title: 'CPU Usage over Time',
      xaxis: {title: 'Time'},
      yaxis: {title: 'CPU Usage (%)'}
  };
  Plotly.newPlot('cpu-usage-plot', [cpuTrace], cpuLayout);

  // ELU Plot for Active and Idle
  const eluTraceActive = {
      x: eluData.map((d, i) => i),
      y: eluData.map(d => d.value.active),
      mode: 'lines',
      name: 'Active',
      line: {
        width: 4  // Increase the line width to make it thicker
    }
  };
  const eluTraceIdle = {
      x: eluData.map((d, i) => i),
      y: eluData.map(d => d.value.idle),
      mode: 'lines',
      name: 'Idle',
      line: {
        width: 4  // Increase the line width to make it thicker
    }
  };
  
  // ELU Plot for Utilization with secondary Y-axis
  const eluTraceUtilization = {
    x: eluData.map((d, i) => i),
    y: eluData.map(d => d.value.utilization),
    mode: 'lines',
    name: 'Utilization%',
    line: {
        color: 'rgba(0, 128, 0, 0.5)', // Lighter shade of green with some transparency
        dash: 'dashdot', // Dashed line
        width: 4 // Thinner line
    },
    yaxis: 'y2' // Use secondary y-axis
};
  
  const eluLayout = {
      title: 'Event Loop Utilization over Time',
      xaxis: {title: 'Time'},
      yaxis: {title: 'Time (ms)'},
      yaxis2: {
        title: 'Utilization',
        overlaying: 'y',
        side: 'right',
        range: [0, 1]  // Set the range from 0 to 100
      }
  };
  // Combine CPU Usage and Utilization % into a single graph
const combinedTraceCPU = {
    x: cpuData.map((d, i) => i),
    y: cpuData.map(d => d.value),
    mode: 'lines',
    name: 'CPU Usage (%)',
    line: {
      width: 4  // Increase the line width to make it thicker
  }
};

const combinedTraceUtilization = {
    x: eluData.map((d, i) => i),
    y: eluData.map(d => d.value.utilization * 100),  // Assuming utilization is between 0 and 1
    mode: 'lines',
    name: 'Utilization %',
    yaxis: 'y2'  // Use secondary y-axis for Utilization
};

const combinedLayout = {
    title: 'CPU Usage and Utilization % over Time',
    xaxis: {title: 'Time'},
    yaxis: {title: 'CPU Usage (%)'},
    yaxis2: {
      title: 'Utilization %',
      overlaying: 'y',
      side: 'right',
      range: [0, 100]  // Set the range from 0 to 100
    }
};

Plotly.newPlot('elu-plot', [eluTraceActive, eluTraceIdle, eluTraceUtilization], eluLayout);
Plotly.newPlot('combined-plot', [combinedTraceCPU, combinedTraceUtilization], combinedLayout);
</script>
`;

  // Combine HTML and Plotting Script
  // Combine HTML, Embedded Data, and Plotting Script
  const htmlDashboard = htmlTemplate + embeddedDataScript + plotScript;
  return htmlDashboard;
  // const filePath = path.join(__dirname, './genDash.html'); // Write to file

  // try {
  //   fs.writeFile(filePath, htmlDashboard);
  //   console.log('Dashboard generated successfully');
  // } catch (err) {
  //   console.log(err);
  // }
}
