import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import "../../styles.scss";
import Typography from '@mui/material/Typography';


const NavBar: React.FC = () => {


  const navigate = useNavigate();


  return (
    <div className="nav-bar">
      <h1 className="logo">gRPSeek</h1>
      <div className="navbar-buttons">
        <button className="tree-button" onClick={() => navigate('/treemap')}>Tree</button>
        <button className="dashboard-button" onClick={() => navigate('/dashboard')}>Dashboard</button>
      </div>
    </div>
  
      
  );
};
export default NavBar;