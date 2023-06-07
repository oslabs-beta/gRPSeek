import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@mui/base";
import Chart from "../components/Chart";
import NavBar from "./NavBar";
import CountUp from "react-countup";

function Dashboard() {
  const [histData, setHistData] = useState([0]);
  const [latencyData, setLatencyData] = useState([0]);
  const [currSecSum, secSum] = useState(0);
  const [currSecCount, secCount] = useState(0);
  const [userCPU, setUserCPU] = useState(0);
  const [systemCPU, setSystemCPU] = useState(0);
  const [chartHistTitle, setHistTitle] = useState("");
  const [chartLatencyTitle, setLatencyTitle] = useState("");


  useEffect(()=> {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3500/metrics");
      const text = await response.json(); // Use .text() instead of .json() if the endpoint returns plain text data.
      console.log(text);
      const histArrOfObj = await text[28].values;
      const latencyArrOfObj = await text[29].values;
      const histArr: number[] = [];
      const latencyArr: number[] = [];
      console.log(latencyArrOfObj[0].value);
      for (let i: number = 0; i < 8; i++) {
        if (i === 0) {
          histArr.push(histArrOfObj[i].value);
        } else {
          histArr.push(histArrOfObj[i].value - histArrOfObj[i - 1].value);
        }
      }

      for (let k: number = 0; k < 6; k++) {
        latencyArr.push(latencyArrOfObj[k].value * 10000);
      }

          secSum(text[28].values[9].value.toFixed(8))
          console.log("secsum", text[28].values[9].value)
          secCount(text[28].values[10].value);
          console.log("setcount",text[28].values[10].value)
          setUserCPU(text[0].values[0].value.toFixed(4));
          console.log("usercpu", text[0].values[0].value);
          setSystemCPU(text[1].values[0].value.toFixed(4));
          console.log("systemcpu", text[1].values[0].value);
          
          setHistTitle(text[28].help)
          setLatencyTitle(text[29].help)

          setHistData(histArr);
          setLatencyData(latencyArr);
    }
    fetchData()
    //  .catch (error) {
    //   console.error("Error fetching metrics:", error);
    // }
  }, [])

  const latencyLabels = [
    "0.1", 
    "0.3", 
    "0.4", 
    "0.5", 
    "0.9", 
    "0.99"
  ];
  const histLabels = [
    "0.0000001",
    "0.0000005",
    "0.000001",
    "0.0000015",
    "0.000002",
    "0.000003",
    "0.000004",
    "0.000005",
  ];

const histYTitle = 'HistY'
const histXTitle = 'HistX'
const latXTitle = 'LatX'
const latYTitle = 'LatY'



  return (
    <>
      <NavBar></NavBar>
      <div className="dashboard-container">
        <div className="dashboard-secondary-container">
          {/* <Button onClick={clickHandler}>Refresh</Button> */}
          <div className="grid-container">
            <div className="box-1">
              <Chart
                data={histData}
                labels={histLabels}
                title={chartHistTitle}
                yTitle={histYTitle}
                xTitle={histXTitle}
              ></Chart>
            </div>
            <div className="box-2">
              <div className="card--title">Seconds Sum</div>
              <div className="card--number">
              <CountUp start={0} end={currSecSum} duration={5} decimals={8} decimal="." />
                </div>
            </div>
            <div className="box-3">
              <div className="card--title">Requests Received</div>
              <div className="card--number">
              <CountUp start={0} end={currSecCount} duration={3.5} />
                </div>
            </div>
            <div className="box-4">
              <div className="card--title">System CPU Sum</div>
              <div className="card--number">
              <CountUp start={0} end={systemCPU} duration={5} decimals={4} decimal="." />
                </div>
            </div>
            <div className="box-5">
              <div className="card--title">User CPU Sum</div>
              <div className="card--number">
              <CountUp start={0} end={userCPU} duration={5} decimals={4} decimal="." />
                </div>
            </div>
            <div className="box-6">
              <Chart
                data={latencyData}
                labels={latencyLabels}
                title={chartLatencyTitle}
                xTitle={latXTitle}
                yTitle={latYTitle}
              ></Chart>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
