import React from "react";
import { useEffect, useState } from "react";
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
import { Button } from "@mui/base";

type Props = {
  data: number[],
  labels: string[],
  title: string
}

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
        position: "top" as const,
      },
      title: {
        display: true,
        text: props.title,
      },
    },
  };

  const labels = props.labels

  const chart = {
    labels,
    datasets: [
      {
        label: "Data",
        data: props.data,
        backgroundColor: "rgba(255, 200, 132, 0.7)",
      },
    ],
  };

  
  return (
    <div className="chart">
      <Bar options={options} data={chart} />
  </div>
  )
};

export default Chart;
