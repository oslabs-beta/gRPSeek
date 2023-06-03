import React from 'react'
import NavBar from '../client/components/NavBar'

function Main() {
  return (
    <div>
    <NavBar/>
    <div className="container">
      <div className="home home--container">
        <h3 className="home home__slogan">
          Click on the buttons above to view your metrics
        </h3>
      </div>
    </div>
    </div>
  )
}

export default Main