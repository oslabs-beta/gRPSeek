import React from "react";
import { useNavigate } from "react-router";
import "../styles.scss";
import { Button } from "@mui/material";

const Home: React.FC = () => {
  const navigate = useNavigate()

  return (

    <div className="container">
      <div className="home home--container">
        <h1 className="home home__title">gRPSeek</h1>
        <h3 className="home home__slogan">
          A POWERFUL VISUALIZATION TOOL FOR gRPC
        </h3>
        <Button variant="contained" onClick={() => navigate('/main')}>Start Seeking</Button>
      </div>
    </div>
  );
};

export default Home;
