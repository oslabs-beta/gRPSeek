import React from "react";
import NavBar from ".././client/components/NavBar";
import BoxMetric from ".././client/components/Box";

const Client: React.FC = () => {
  const fakeClientData = [
    { metric: "Total Client Calls", total: 15 },
    { metric: "Avg Client Calls ", total: 45 },
    { metric: "Min Client Calls", total: 11 },
    { metric: "Max Client Calls", total: 9 },
    { metric: "All Client Calls", total: 56 },
  ];

  return (
    <>
      <NavBar></NavBar>
      <h1>Client</h1>
      <div className="grid--container">
        {fakeClientData.map(data => (
          <BoxMetric  />
        ))}
      </div>
    </>
  );
};

export default Client;
