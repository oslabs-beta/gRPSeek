import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import "../../styles.scss";
import Typography from '@mui/material/Typography';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  async function getMetrics() {
    const response = await fetch('localhost:9090/metrics');
    const json = await response.json();
    console.log(json)
  }
  return (
    <div><div className="flex-1 small-size">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
    <a href="http://localhost:8080/"><div className="logo"><h1>
    gRPSeek
  </h1></div></a>
  </div>
      <div className="navbar--container">
        <ButtonGroup
          size="large"
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            className=""> Load Testing Visualizer </Button>
          <Button
            className="button button--primary"
            style={{width: '10rem'}}
            onClick={() => {
              navigate("/metrics");
            }}
          >
            Metrics
          </Button>
          <Button
            className="button button--primary"
            style={{width: '10rem'}}
            onClick={() => {
              navigate("/graph");
            }}
          >
            Graph
          </Button>
          <Button
            className="button button--primary"
            style={{width: '10rem'}}
            onClick={() => {
              navigate("/treemap");
            }}
          >
            Tree Map
          </Button>
        </ButtonGroup>
      </div>
      </div>
  );
};

export default NavBar;
