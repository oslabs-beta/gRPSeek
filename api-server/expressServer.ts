// import express, {Express, Request, Response} from 'express';
// import cors from 'cors';
// const app = express();
// app.use(cors())
// const PORT = 3000;


// app.get('/', (req,res) => {
//   res.status(200).send('Sanity Check');
// });





// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });
import express, { Request, Response } from 'express';
import cors from 'cors';

import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../proto/helloworld'
import * as fs from 'fs';


const app = express();
const PORT = process.env.PORT || 3000;

const GRPC_PORT = 8082;
const PROTO_FILE = '../proto/helloworld.proto';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType;

const client = new grpcObj.greeterPackage.Greeter(
  `0.0.0.0:${GRPC_PORT}`, grpc.credentials.createInsecure()
);

let latencies: bigint[] = [];
const logBuffer: string[] = [];
// Function to make a single request and record the latency
function makeRequest(name: string, requestId: number): Promise<any> {
  const startTime = process.hrtime.bigint();
  return new Promise((resolve, reject) => {
    client.SayHello({ name }, (err, result) => {
      const endTime = process.hrtime.bigint();
      const latency = endTime - startTime;
      latencies.push(latency);
      const logMessage = `Request number ${requestId}: Call to /greeterPackage.Greeter/SayHello took ${latency} nanoseconds\n`;
      logBuffer.push(logMessage);
      if (err) { 
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

async function runTest() {
  // // let latencies: bigint[] = [];
  // const logBuffer: string[] = [];
  const duration = 1000; // Duration of the test in milliseconds
  const concurrentRequests = 100; // Number of concurrent requests
  let requestId = 0; // Keep track of the request number

  const promises = Array(concurrentRequests).fill(null).map(() => {
    return new Promise<void>(async (resolve) => {
      const startTime = Date.now();
      while (Date.now() - startTime < duration) {
        await makeRequest('Kenny', requestId++);
      }
      resolve();
    });
  });

  await Promise.all(promises);

  // Calculate and log the average latency for all calls
  const averageLatency = latencies.reduce((a, b) => a + b) / BigInt(latencies.length);
  console.log(`Average latency for all calls: ${averageLatency} nanoseconds`);

  // Write log buffer to file
  // fs.writeFileSync('../logs.txt', logBuffer.join(''));
  try {
    const logFilePath = path.resolve(__dirname, '..', 'logs.txt');
    console.log(`Writing logs to: ${logFilePath}`);
    fs.writeFileSync(logFilePath, logBuffer.join(''));
    console.log('Logs written successfully');
  } catch (error) {
    console.error('Error writing logs:', error);
  }

  console.log('Finished sending requests');
  return { averageLatency };
}

function requestData (){
  const logFile = path.resolve(__dirname, '..', 'logs.txt');
  
    const logData = fs.readFileSync(logFile, 'utf8');
    const lines = logData.split('\n');
    const requestData = lines.map(line => {
      const match = line.match(/Request number (\d+): Call to \/greeterPackage\.Greeter\/SayHello took (\d+) nanoseconds/);
      if (match) {
        return {
          requestNumber: parseInt(match[1], 10),
          latency: parseInt(match[2], 10) / 1e6 // Convert to milliseconds
        };
      }
      return null;
    }).filter(item => item !== null);
  //  console.log(requestData)
    if(requestData)return requestData;
}

// Route to start the load test
app.use(cors())
app.post('/api/start-load-test', async (req: Request, res: Response) => {
  console.log("Received Request from React, Attempting to Invoke gRPC Server now...")
  try {
    // const results = await runTest();
    // res.json(results);
    const { averageLatency } = await runTest();
    const metrics = await requestData();
    res.json({ averageLatency: averageLatency.toString(), numbers: metrics});
    
  } catch (error) {
    console.log("ERROR trying to invoke gRPC Server: ", error);
    res.status(500).send('An error occurred while running the test');
  }
});



// app.post('/requestData', (req, res) => {
//   const logFile = '../logs.txt';
//   const logData = fs.readFileSync(logFile, 'utf8');
//   const lines = logData.split('\n');
//   const requestData = lines.map(line => {
//     const match = line.match(/Request number (\d+): Call to \/greeterPackage\.Greeter\/SayHello took (\d+) nanoseconds/);
//     if (match) {
//       return {
//         requestNumber: parseInt(match[1], 10),
//         latency: parseInt(match[2], 10) / 1e6 // Convert to milliseconds
//       };
//     }
//     return null;
//   }).filter(item => item !== null);

//   res.json(requestData);
// });
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
