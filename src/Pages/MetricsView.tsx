import React from "react";
import NavBar from "../client/components/NavBar";
import BoxMetric from "../client/components/Box";


const MetricsView: React.FC = () => {
  const fakeClientData = [
    { metric: "Total Client Calls", total: 15 },
    { metric: "Avg Client Calls ", total: 45 },
    { metric: "Min Client Calls", total: 11 },
    { metric: "Max Client Calls", total: 9 },
    { metric: "Client Calls", total: 56 },
    { metric: "ient Calls", total: 5 },
    { metric: "ACalls", total: 9 },
    { metric: "ent Calls", total: 1 },
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
