import React from 'react'
import Dashboard from '../client/components/Dashboard'
import NavBar from '../client/components/NavBar'

const Main: React.FC = () => {
  return (
    <div className='navbar-dashboard-container'>
    <NavBar/>
    <Dashboard/>
    </div>
  )
}

export default Main