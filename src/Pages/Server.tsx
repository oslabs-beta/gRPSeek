import React from "react";
import NavBar from ".././client/components/NavBar";
import BoxMetric from ".././client/components/Box";

const Server: React.FC = () => {

  const fakeServerData = [
    { metric: "Total Server Calls", total: 15 },
    { metric: "Avg Server Calls ", total: 66 },
    { metric: "Min Server Calls", total: 21 },
    { metric: "Max Server Calls", total: 99 },
    { metric: "All Server Calls", total: 7 },
  ];

  return (
    <>
      <NavBar></NavBar>
      <h1>Server</h1>
      <div className="grid--container">
        {fakeServerData.map(data => (
          <BoxMetric  />
        ))}
      </div>
    </>
  );
};

export default Server;
