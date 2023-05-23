import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home'
import Client from './Pages/Client'
import Server from './Pages/Server'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/client" element={<Client/>}></Route>
        <Route path="/server" element={<Server/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
