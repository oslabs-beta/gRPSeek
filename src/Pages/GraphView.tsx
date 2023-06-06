import React from "react";
import NavBar from "../client/components/NavBar";
// import BoxMetric from "../client/components/Box";
import Chart from "../client/components/Chart";
import {useEffect} from 'react'

const GraphView: React.FC = () => {
  const fakeServerData = [
    { metric: "Total Server Calls", total: 15 },
    { metric: "Avg Server Calls ", total: 66 },
    { metric: "Min Server Calls", total: 21 },
    { metric: "Max Server Calls", total: 99 },
    { metric: "All Server Calls", total: 7 },
  ];
  useEffect( ()=> {
   fetch('http://localhost:9090/metrics', {
    headers: {
      'content-type': 'application/json'
    }
   })
   .then(res => console.log(res))
   .catch(err => console.log("error: ", err))
  }, []);
 
  return (
    <>
    <NavBar/>
    <Chart/>
    </>
  );
};

export default GraphView;
