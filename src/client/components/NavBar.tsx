import * as React from "react";
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
      <button className=""></button>
    </div>
  
      
  );
};
export default NavBar;