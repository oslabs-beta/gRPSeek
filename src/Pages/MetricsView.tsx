import React from "react";
import NavBar from "../client/components/NavBar";
import BoxMetric from "../client/components/Box";


const MetricsView: React.FC = () => {
  const fakeClientData = [
    { metric: "Client Started", total: 15 },
    { metric: "Client Handled", total: 45 },
    { metric: "Client Msg Received", total: 11 },
    { metric: "Client Msg Sent", total: 9 },
    { metric: "Server Started", total: 56 },
    { metric: "Server Handled", total: 5 },
    { metric: "Server Msg Received", total: 9 },
    { metric: "Server Msg Sent", total: 2 },
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
