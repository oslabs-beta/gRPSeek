import React from "react";
import { useEffect } from "react";
import NavBar from "../client/components/NavBar"

const Home:React.FC = () => {
    useEffect(() => {
        fetch('/metrics')
        .then((data) => data.json())
        .then((parsed) => {
          console.log(parsed)
        })
        .catch((err) => {
          console.log(err);
        });
      }, []);
    return (
        <>
        <NavBar></NavBar>
        </>
    )
}

export default Home;