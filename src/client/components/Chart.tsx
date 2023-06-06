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


const Chart: React.FC = () => {

const [currentData, setData] = useState([])

const clickHandler = async () => {
  try {
      const response = await fetch('http://localhost:3500/metrics');
      const text = await response.json(); // Use .text() instead of .json() if the endpoint returns plain text data.
      console.log(text)
      const dataaa = await text[28].values
      const arr = []
      for(let i:number = 0; i < 8; i++){
        if(i === 0){
          arr.push(dataaa[i].value);
        } else{
          arr.push(dataaa[i].value - dataaa[i-1].value);
        }
      }
      //console.log(data)
      setData(arr)
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  }


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
      text: "gRPC Server & Client Handling Seconds",
    },
  },
};

const labels = ['0.0000001', '0.0000005','0.000001', '0.0000015', '0.000002', '0.000003', '0.000004', '0.000005']


const data1 = {
  labels,
  datasets: [
    {
      label: "Client",
      data: currentData,
      backgroundColor: "rgba(255, 200, 132, 0.7)",
    },
  ],
};
  

  return (
    <div className='chart'>
      <Button onClick={clickHandler}>clickkk me for metricssss</Button>
      <Bar options={options} data={data1} />
  </div>
  )
};

export default Chart;
