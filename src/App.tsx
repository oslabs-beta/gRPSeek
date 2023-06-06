import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home'
// import Client from './Pages/MetricsView'
// import Server from './Pages/GraphView'
import Main from "./Pages/Main";
// import MetricsView from "./Pages/MetricsView";
import GraphView from "./Pages/GraphView";
import TreeMapView from "./Pages/TreetMapView";
import Dashboard from "./client/components/Dashboard";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/graph" element={<GraphView/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/main" element={<Main/>}></Route>
        <Route path="/treemap" element={<TreeMapView/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
