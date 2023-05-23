import React from "react";
import NavBar from ".././client/components/NavBar"
import BoxMetric from ".././client/components/Box"

const Client:React.FC = () => {
    return (
        <>
        <div>
        <NavBar></NavBar>
        <h1>
            hello world from Client
        </h1>
        <BoxMetric />
        </div>
        </>
    )
}

export default Client;