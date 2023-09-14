import React from 'react';
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import '../styles/LatencyGraphs.css'
interface LatencyData {
  requestNumber: number,
  latency: number 
}

const Graphs: React.FC = () => {
  // const [timeData, setTimeData] = useState<TimeData[]>([]);
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:8081/requestData')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setLatencyData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const requestNumbers = latencyData.map((item) => item.requestNumber);
  const latencies = latencyData.map(item => item.latency);


  if (isLoading) {
    return <h1>Loading...🌀</h1>;
  }

  if (error) {
    return <h1>Error:🛑 {error}</h1>;
  }

  return (

      <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Time-Series Dashboard</h1>
        {/* Add any header buttons or actions here */}
      </div>
      <div className="plot-container">
      <Plot
        data={[
          {
            x: requestNumbers,
            y: latencies,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue', size: 8 },
            line: { color: 'blue', width: 2, shape: 'spline' },
          },
        ]}
        layout={{
          title: 'Latency Over Time',
          xaxis: { title: 'Request Number', showgrid: false, zeroline: false },
          yaxis: { title: 'Latency', showline: false },
          hovermode: 'closest',
          plot_bgcolor: '#f3f3f3',
        }}
      />
     <Plot
        data={[
          {
            x: latencies,
            type: 'histogram',
            marker: { color: 'green' },
          },
        ]}
        layout={{
          title: 'Latency Distribution',
          xaxis: { title: 'Latency', showgrid: false, zeroline: false },
          yaxis: { title: 'Frequency', showline: false },
          barmode: 'overlay',
          bargap: 0.05,
          plot_bgcolor: '#f3f3f3',
        }}
      />
      <Plot
        data={[
          {
            y: latencies,
            type: 'box',
            boxpoints: 'all',
            jitter: 0.3,
            pointpos: -1.8,
          },
        ]}
        layout={{
          title: 'Latency Summary',
          yaxis: { title: 'Latency', showline: false },
          plot_bgcolor: '#f3f3f3',
        }}
      />
      <Plot
        data={[
          {
            x: requestNumbers,
            y: latencies,
            mode: 'markers',
            type: 'scatter',
          },
        ]}
        layout={{ title: 'Latency Scatter Plot', xaxis: { title: 'Number of Requests' }, yaxis: { title: 'Latency' } }}
      />
      

    </div>
       
    </div>
  );
};

export default Graphs;