import React from "react";
import NavBar from "../client/components/NavBar";
import BoxMetric from "../client/components/Box";


const MetricsView: React.FC = () => {
  const fakeClientData: {metric: string, total: number}[] = [
    { metric: "Total Client Calls", total: 52 },
    { metric: "Avg Client Calls ", total: 45 },
    { metric: "Min Client Calls", total: 38 },
    { metric: "Max Client Calls", total: 60 },
    { metric: "Total Server Calls", total: 56 },
    { metric: "Avg Server Calls", total: 6 },
    { metric: "Min Server Calls", total: 3 },
    { metric: "Max Server Calls", total: 10 },
  ];

  return (
    <>
      <NavBar></NavBar>
      <div className="grid--container__container">
        <div className="grid--container">
          {fakeClientData.map((data, index) => (
            <BoxMetric metric={data.metric} total={data.total} id = {index}/>
          ))}
        </div>
      </div>
    </>
  );
};

export default MetricsView;
