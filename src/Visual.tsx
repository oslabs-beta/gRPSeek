// import React, { useEffect, useState } from 'react';
// import Plot from 'react-plotly.js';

// // Type 
// interface VisualProps {
//   requestData: { requestNumber: number; latency: number }[];
// }

// export default function Visual({ requestData }: VisualProps) {
//   const [plots, setPlots] = useState<any[]>([]);
// const latencies = requestData.map((item) => item.latency);
//   useEffect(() => {
//     fetch('/requestData')
//       .then((response) => response.json())
//       .then((data) => {
//         const requestData = data;
//         const latencies = requestData.map((item: any) => item.latency);

//         // Line Chart
//         const lineTrace = {
//           x: requestData.map((item: any) => item.requestNumber),
//           y: latencies,
//           type: 'scatter',
//           mode: 'lines',
//         };

//         // Histogram
//         const histogramTrace = {
//           x: latencies,
//           type: 'histogram',
//         };

//         // Box Plot
//         const boxTrace = {
//           y: latencies,
//           type: 'box',
//         };

//         // Scatter Plot
//         const scatterTrace = {
//           x: requestData.map((item: any) => item.requestNumber),
//           y: latencies,
//           mode: 'markers',
//           type: 'scatter',
//         };

//         setPlots([
//           { data: [lineTrace], layout: { title: 'Latency Over Time', xaxis: { title: 'Request Number' }, yaxis: { title: 'Latency (ms)' } } },
//           { data: [histogramTrace], layout: { title: 'Latency Distribution', xaxis: { title: 'Latency (ms)' }, yaxis: { title: 'Frequency' } } },
//           { data: [boxTrace], layout: { title: 'Latency Summary', yaxis: { title: 'Latency (ms)' } } },
//           { data: [scatterTrace], layout: { title: 'Latency Scatter Plot', xaxis: { title: 'Request Number' }, yaxis: { title: 'Latency (ms)' } } },
//         ]);
//       })
//       .catch((error) => {
//         console.error('Error fetching requestData:', error);
//       });
//   }, []);

//   return (
//     <div>
//       {plots.map((plot, index) => (
//         <Plot key={index} data={plot.data} layout={plot.layout} />
//       ))}
//     </div>
//   );
// }

import  { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

// Type 
interface VisualProps {
  requestData: { requestNumber: number; latency: number }[];
}

export default function Visual({ requestData }: VisualProps) {
  const [plots, setPlots] = useState<any[]>([]);

  // Extract latencies from requestData
  const latencies = requestData.map((item) => item.latency);
  function unpack(rows:any, key:any) {
    return rows.map(function(row:any) { return row[key]; });
  }
  useEffect(() => {
    // Line Chart
    const lineTrace = {
      x: requestData.map((item) => item.requestNumber),
      y: latencies,
      type: 'scatter',
      mode: 'lines',
      fillcolor: "rgba(231,107,243,0.2)", 
      line: {color: "transparent"},
      rangeslider: { visible: true } 
      , 
    };
    const lineTrace2 = {
      type: "scatter",
      mode: "lines",
      name: 'AAPL High',
      x: unpack(latencies, 'Time'),
      y: unpack(latencies, 'AAPL.High'),
      line: {color: '#17BECF'}
    }
      // Histogram
    
      const histogramTrace = {
        x: latencies,
        type: 'histogram',
      };
    
   

    // Box Plot
    const boxTrace = {
      y: latencies,
      type: 'box',
    };

    // Scatter Plot
    const scatterTrace = {
      x: requestData.map((item) => item.requestNumber),
      y: latencies,
      mode: 'markers',
      type: 'scatter',
    };

    setPlots([
      { data: [lineTrace], layout: { title: 'Latency Over Time', xaxis: { title: 'Request Number' }, yaxis: { title: 'Latency (ms)' } } },
      { data: [histogramTrace], layout: { title: 'Latency Distribution', xaxis: { title: 'Latency (ms)' }, yaxis: { title: 'Frequency' } } },
      { data: [boxTrace], layout: { title: 'Latency Summary', yaxis: { title: 'Latency (ms)' } } },
      { data: [scatterTrace], layout: { title: 'Latency Scatter Plot', xaxis: { title: 'Request Number' }, yaxis: { title: 'Latency (ms)' } } },
    ]);
  }, [requestData]); // Include requestData in dependency array

  return (
    <div>
      {plots.map((plot, index) => (
        <Plot key={index} data={plot.data} layout={plot.layout} />
      ))}
    </div>
  );
}
