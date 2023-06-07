import React from 'react';
import { useEffect, useState } from 'react';
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
import Chart from "../components/Chart";

function Dashboard() {
    const [histData, setHistData] = useState([0]);
    const [latencyData, setLatencyData] = useState([0])
    const [currSecSum, secSum] = useState(0);
    const [currSecCount, secCount] = useState(0);
    const [currBytes, setBytes] = useState(0);
    const [latencySum, setLatencySum] = useState(0);
    const [chartHistTitle, setHistTitle] = useState('');
    const [chartLatencyTitle, setLatencyTitle] = useState('');


    const clickHandler = async () => {
      try {
          const response = await fetch('http://localhost:3500/metrics');
          const text = await response.json(); // Use .text() instead of .json() if the endpoint returns plain text data.
          console.log(text)
          const histArrOfObj = await text[28].values;
          const latencyArrOfObj = await text[29].values;
          const histArr: number[] = [];
          const latencyArr: number[] = [];
          console.log(latencyArrOfObj[0].value)
          for(let i:number = 0; i < 8; i++){
            if (i === 0){
              histArr.push(histArrOfObj[i].value);
            } else{
              histArr.push(histArrOfObj[i].value - histArrOfObj[i-1].value);
            }
          }

          for(let k:number = 0; k < 6; k++){
              console.log(latencyArrOfObj[k].value * 10000)
              latencyArr.push(latencyArrOfObj[k].value * 10000);
          }


          secSum(text[28].values[9].value);
          console.log("secsum", text[28].values[9].value)
          secCount(text[28].values[10].value);
          console.log("setcount",text[28].values[10].value)
          setBytes(text[30].values[5].value);
          console.log("setbytes", text[30].values[5].value);
          setLatencySum(text[29].values[6].value);
          console.log(text[29].values[6].value);
          
          setHistTitle(text[28].help)
          setLatencyTitle(text[29].help)

          setHistData(histArr);
          setLatencyData(latencyArr);

        } catch (error) {
          console.error("Error fetching metrics:", error);
        }
      }
    
    



    // ChartJS.register(
    //   CategoryScale,
    //   LinearScale,
    //   BarElement,
    //   Title,
    //   Tooltip,
    //   Legend
    // );
    
    // const latencyOptions = {
    //   responsive: true,
    //   plugins: {
    //     legend: {
    //       position: "top" as const,
    //     },
    //     title: {
    //       display: true,
    //       text: "gRPC Server & Client Handling Seconds",
    //     },
    //   },
    // };

    const latencyLabels = ['0.1', '0.3','0.4', '0.5', '0.9', '0.99']
    const histLabels = ['0.0000001', '0.0000005', '0.000001', '0.0000015', '0.000002', '0.000003', '0.000004', '0.000005']
    
    // const latencyChart = {
    //   labels,
    //   datasets: [
    //     {
    //       label: "Client",
    //       data: histData,
    //       backgroundColor: "rgba(255, 200, 132, 0.7)",
    //     },
    //   ],
    // };

  return (
    //grid container
    //return graphs and metrics
    <div>
    <div>Dashboard</div>
    <div className='chart'>
      <Button onClick={clickHandler}>Refresh</Button>
      <Chart data={histData} labels={histLabels} title={chartHistTitle}></Chart>
      <Chart data={latencyData} labels={latencyLabels} title={chartLatencyTitle}></Chart>
  </div>
  </div>
  )
};

export default Dashboard