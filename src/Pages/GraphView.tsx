import React from "react";
import NavBar from "../client/components/NavBar";
import BoxMetric from "../client/components/Box";

const GraphView: React.FC = () => {
  const fakeServerData = [
    { metric: "Total Server Calls", total: 15 },
    { metric: "Avg Server Calls ", total: 66 },
    { metric: "Min Server Calls", total: 21 },
    { metric: "Max Server Calls", total: 99 },
    { metric: "All Server Calls", total: 7 },
  ];

  return (
    <NavBar/>
  );
};

export default GraphView;
