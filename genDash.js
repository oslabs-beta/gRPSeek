"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGrpcLoadTestDashboard = void 0;
/**
 * Generate gRPC Load Test Dashboard
 * @param {Array} cpuData - The CPU usage data.
 * @param {Array} eluData - The Event Loop Utilization data.
 * @returns {String} - The HTML string for the dashboard.

 */
function generateGrpcLoadTestDashboard(cpuData, eluData) {
    var embeddedDataScript = "\n  <script>\n    const cpuData = ".concat(JSON.stringify(cpuData), ";\n    const eluData = ").concat(JSON.stringify(eluData), ";\n  </script>\n  ");
    // HTML structure
    var htmlTemplate = "\n  <!DOCTYPE html>\n  <html lang=\"en\">\n  <head>\n      <meta charset=\"UTF-8\">\n      <title>gRPC Load Test Dashboard</title>\n      <!-- Including Plotly.js CDN -->\n      <script src=\"https://cdn.plot.ly/plotly-latest.min.js\"></script>\n  </head>\n  <body>\n      <h1>gRPC Load Test Metrics Dashboard</h1>\n      <!-- CPU Usage Plot -->\n      <div id=\"cpu-usage-plot\" style=\"width: 100%; height: 400px;\"></div>\n      <!-- Event Loop Utilization Plot -->\n      <div id=\"elu-plot\" style=\"width: 100%; height: 400px;\"></div>\n      <!-- Combined CPU Usage and Utilization % Plot -->\n<div id=\"combined-plot\" style=\"width: 100%; height: 400px;\"></div>\n\n  </body>\n  </html>\n  ";
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
    var plotScript = "\n<script>\n  // CPU Usage Plot\n  const cpuTrace = {\n      x: cpuData.map((d, i) => i),\n      y: cpuData.map(d => d.value),\n      mode: 'lines',\n      name: 'CPU Usage',\n      line: {\n        width: 4 // Increase the line width to make it thicker\n    }\n  };\n  const cpuLayout = {\n      title: 'CPU Usage over Time',\n      xaxis: {title: 'Time'},\n      yaxis: {title: 'CPU Usage (%)'}\n  };\n  Plotly.newPlot('cpu-usage-plot', [cpuTrace], cpuLayout);\n\n  // ELU Plot for Active and Idle\n  const eluTraceActive = {\n      x: eluData.map((d, i) => i),\n      y: eluData.map(d => d.value.active),\n      mode: 'lines',\n      name: 'Active',\n      line: {\n        width: 4  // Increase the line width to make it thicker\n    }\n  };\n  const eluTraceIdle = {\n      x: eluData.map((d, i) => i),\n      y: eluData.map(d => d.value.idle),\n      mode: 'lines',\n      name: 'Idle',\n      line: {\n        width: 4  // Increase the line width to make it thicker\n    }\n  };\n  \n  // ELU Plot for Utilization with secondary Y-axis\n  const eluTraceUtilization = {\n    x: eluData.map((d, i) => i),\n    y: eluData.map(d => d.value.utilization),\n    mode: 'lines',\n    name: 'Utilization%',\n    line: {\n        color: 'rgba(0, 128, 0, 0.5)', // Lighter shade of green with some transparency\n        dash: 'dashdot', // Dashed line\n        width: 4 // Thinner line\n    },\n    yaxis: 'y2' // Use secondary y-axis\n};\n  \n  const eluLayout = {\n      title: 'Event Loop Utilization over Time',\n      xaxis: {title: 'Time'},\n      yaxis: {title: 'Time (ms)'},\n      yaxis2: {\n        title: 'Utilization',\n        overlaying: 'y',\n        side: 'right',\n        range: [0, 1]  // Set the range from 0 to 100\n      }\n  };\n  // Combine CPU Usage and Utilization % into a single graph\nconst combinedTraceCPU = {\n    x: cpuData.map((d, i) => i),\n    y: cpuData.map(d => d.value),\n    mode: 'lines',\n    name: 'CPU Usage (%)',\n    line: {\n      width: 4  // Increase the line width to make it thicker\n  }\n};\n\nconst combinedTraceUtilization = {\n    x: eluData.map((d, i) => i),\n    y: eluData.map(d => d.value.utilization * 100),  // Assuming utilization is between 0 and 1\n    mode: 'lines',\n    name: 'Utilization %',\n    yaxis: 'y2'  // Use secondary y-axis for Utilization\n};\n\nconst combinedLayout = {\n    title: 'CPU Usage and Utilization % over Time',\n    xaxis: {title: 'Time'},\n    yaxis: {title: 'CPU Usage (%)'},\n    yaxis2: {\n      title: 'Utilization %',\n      overlaying: 'y',\n      side: 'right',\n      range: [0, 100]  // Set the range from 0 to 100\n    }\n};\n\nPlotly.newPlot('elu-plot', [eluTraceActive, eluTraceIdle, eluTraceUtilization], eluLayout);\nPlotly.newPlot('combined-plot', [combinedTraceCPU, combinedTraceUtilization], combinedLayout);\n</script>\n";
    // Combine HTML and Plotting Script
    // Combine HTML, Embedded Data, and Plotting Script
    var htmlDashboard = htmlTemplate + embeddedDataScript + plotScript;
    return htmlDashboard;
    // const filePath = path.join(__dirname, './genDash.html'); // Write to file
    // try {
    //   fs.writeFile(filePath, htmlDashboard);
    //   console.log('Dashboard generated successfully');
    // } catch (err) {
    //   console.log(err);
    // }
}
exports.generateGrpcLoadTestDashboard = generateGrpcLoadTestDashboard;
