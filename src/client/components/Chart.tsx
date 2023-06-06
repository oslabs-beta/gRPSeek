import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "gRPC Server & Client Handling Seconds",
    },
  },
};

const labels = [
  "0.001",
  "0.004",
  "0.016",
  "0.064",
  "0.256",
  "1.024",
  "4.096",
  "16.384",
  "65.536",
  "262.144",
  "1048.576",
  "4194.304",
];
const fakeDataClient = [1, 4, 5, 0, 2, 1, 1, 0, 1, 0, 0, 0];
const fakeDataServer = [2, 1, 7, 1, 0, 1, 1, 0, 0, 0, 0, 0];

export const data = {
  labels,
  datasets: [
    {
      label: "Client",
      data: fakeDataClient,
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Server",
      data: fakeDataServer,
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const Chart: React.FC = () => {
  return (
    <div className='chart'>
      <Bar options={options} data={data} />
      <iframe src="http://localhost:3000/d-solo/null?orgId=1&from=1685190326701&to=1685211926701&panelId=123124" width="450" height="200" frameBorder="0"></iframe>
    <div>
    <img src='https://johncamilomcconnell.grafana.net/d/a53a3e5d-42e6-4ffe-a52f-23bc390c648f/new-dashboard?orgId=1&from=1685179807199&to=1685201407199&viewPanel=1'/>
      
      </div>
  </div>
  )
};

export default Chart;
