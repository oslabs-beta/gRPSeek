import React from "react";
import "../styles.scss";

const Home: React.FC = () => {
  return (

    <div className="container">
      <div className="home home--container">
        <h1 className="home home__title">gRPSeek</h1>
        <h3 className="home home__slogan">
          A POWERFUL METRIC VISUALIZATION TOOL FOR gRPC
        </h3>
      </div>
    </div>
  );
};

export default Home;
