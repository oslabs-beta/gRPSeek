import React from "react";
import NavBar from ".././client/components/NavBar"
import BoxMetric from ".././client/components/Box"

const Server:React.FC = () => {
    return (
        <>
        <div>
        <NavBar></NavBar>
        <h1>
            hello world from Server
        </h1>
        <BoxMetric />
        </div>
        </>
    )
}

export default Server;