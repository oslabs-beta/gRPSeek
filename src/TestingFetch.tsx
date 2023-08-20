import {useEffect, useState} from 'react';
import axios from 'axios';
import Visual from './Visual';
// // TypeScript could not infer the type of "results" so I had to put this
interface TestResults {
  averageLatency: string;
  numbers: { requestNumber: number; latency: number }[];
}
// export const TestingFetch = () => {

//   const [status, setStatus] = useState('Ready to start test');
//   const [results, setResults] = useState<TestResults | null>(null);

//   const startTest = async () => {
//     setStatus('Test started...');
//     try {

//       const response = await axios.post<TestResults>('http://localhost:3000/api/start-load-test');

//       setResults(response.data);
//       setStatus('Test completed');
//     } catch (error) {
//       setStatus('An error occurred while running the test');
//       console.error(error);
//     }
//   };


  
//   return (
//     <div>
//       <button onClick={startTest}>Start Test</button>
//       <p>{status}</p>
//       {results && (
//         <div>
//           <h3>Test Results:</h3>
//           <p>Average latency for all calls: {results.averageLatency} nanoseconds</p>
//           <p>{results.numbers}</p>
//         </div>
//       )}
//     </div>
//   )
// }

export const TestingFetch = () => {
  const [status, setStatus] = useState('Ready to start test');
  const [results, setResults] = useState<TestResults | null>(null);

  const startTest = async () => {
    setStatus('Test started...');
    try {
      const response = await axios.post('http://localhost:3000/api/start-load-test');
      setResults(response.data);
      setStatus('Test completed');
    } catch (error) {
      setStatus('An error occurred while running the test');
      console.error(error);
    }
  };
  const requestData = results ? results.numbers : [];

  return (
    <div>
      <button onClick={startTest}>Start Test</button>
      <p>{status}</p>
     {results &&  <Visual requestData={results.numbers} />}
      {results && (
        <div>
          <p>Average Latency: {results.averageLatency} nanoseconds</p>
          <h3>Metrics:</h3>
          <ul>
            {results.numbers.map((item, index) => (
              <li key={index}>
                 {item.latency} milliseconds
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
