import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

type Props = {
  data: number[];
  labels: string[];
  title: string;
  yTitle: string;
  xTitle: string;
};

const Chart: React.FC<Props> = (props) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: props.title,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: props.yTitle,
        },
      },
      x: {
        title: {
          display: true,
          text: props.xTitle,
        },
      },
    },
  };

  const labels = props.labels;

  const chart = {
    labels,
    datasets: [
      {
        label: 'Data',
        data: props.data,
        backgroundColor: 'rgba(52, 95, 95, 0.8)',
      },
    ],
  };

  return (
    <div className="chart">
      <Bar options={options} data={chart} />
    </div>
  );
};

export default Chart;
