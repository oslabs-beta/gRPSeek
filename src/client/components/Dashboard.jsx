import React from 'react'

function Dashboard() {


    //fetch data logic



  return (
    //grid container
    //return graphs and metrics
    <div className='dashboard-container'>
        <div className='dashboard-secondary-container'>
            <div className='grid-container'>
                <div className='box-1'>GRAPH 1</div>
                <div className='box-2'>Total gRPC Requests</div>
                <div className='box-3'>Duration Sum</div>
                <div className='box-4'>Bytes</div>
                <div className='box-5'>Sum of Latency</div>
                <div className='box-6'>GRAPH 2</div>
            </div>



        </div>
    </div>



  )
}

export default Dashboard