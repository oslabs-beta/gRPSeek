import React from "react";
import "../styles.scss";
import NavBar from ".././client/components/NavBar"

const Home: React.FC = () => {
  return (

    <div className="container">
      <div className="home home--container">
        <h1 className="home home__title">gRPSeek</h1>
        <h3 className="home home__slogan">
          A POWERFUL METRIC VISUALIZATION TOOL FOR gRPC
        </h3>
      </div>
      <NavBar />
    </div>
  );
};

export default Home;
