import {useEffect} from 'react';
export const TestingFetch = () => {
  
  const fetchData = async() => {
    const res =  await fetch('http://localhost:3000/');
    console.log(res.text)
  }
  useEffect(() => {
        fetchData()
  }, [])

  
  return (
    <div>
      Heyo
    </div>
  )
}
