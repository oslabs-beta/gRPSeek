const cluster = require('cluster');
import { availableParallelism } from 'node:os';
import { stdin as input, stdout as output } from 'node:process';
import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from 'node:worker_threads';
import * as readline from 'node:readline/promises';
import * as path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../proto/helloworld';
import MetricInterceptor from './loadTester';

const readLine = readline.createInterface({ input, output });
const numCPUs = availableParallelism();

async function inputQuery(
  label: string,
  question: string,
  errorMsg: string = `Input was not a number`
): Promise<number> {
  let numInput = parseInt(await readLine.question(`${question}\n`));
  while (isNaN(numInput)) {
    console.log(`\x1b[91m \nERROR: ${errorMsg}. Please try again.\x1b[0m`);
    numInput = parseInt(await readLine.question(`${question}\n`));
  }
  console.log(`\n${label} Input: ${numInput}`);
  return numInput;
}
/** CURRENT HYPOTHESIS: MAIN FUNCTION IS REPEATED FOR ALL WORKER THREADS. WOULD HAVE TO TAKE THE INPUT CODE OUT AND MOVE IT. ALSO HAVE TO UTILIZE MAIN PROCESS/THREAD SO TOTAL NUMBER OF CALLS ACROSS ALL THREADS EQUATE TO NUMBER OF CALLS THE CLIENT WANTS
 *
 * IF cntrl c does not work, open console and type 'ps'
 * find the pid of the node cluster.js process
 * in console type 'kill -9 <pid>'
 */

async function gatherInputs(): Promise<{
  numClusters: number;
  numWorkers: number;
  numCalls: number;
}> {
  const numClusters = await inputQuery(
    `NumClusters`,
    `How many clusters? Recommended Number (Max Number of CPUs): ${numCPUs}`
  );
  const maxNumberofWorkersPerCluster = Math.floor(numCPUs / numClusters);
  const numWorkers = await inputQuery(
    `NumWorkers`,
    `How many worker threads per cluster? Recommended Number: ${maxNumberofWorkersPerCluster}`
  );
  const numCalls = await inputQuery(
    `NumCalls`,
    `How many calls per thread to the server?`
  );

  return { numClusters, numWorkers, numCalls };
}
export async function main() {
  //create a client server with num clusters and worker threads on each cluster
  if (cluster.isPrimary && isMainThread) {
    console.log(
      `This is the gRPSeek Load Balance Tester! The tester requires you to input the number of concurrent processes you'd like to run to simulate a grpc server load.`
    );

    const { numClusters, numWorkers, numCalls } = await gatherInputs();

    //Main process - set up cluster workers
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numClusters; i++) {
      cluster.fork({ numWorkers, numCalls });
    }
    cluster.on('online', (worker) => {
      console.log(`worker ${worker.process.pid} is forked and running`);
    });

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      if (Object.keys(cluster.workers).length === 0) {
        // All workers have exited, close readLine and exit
        readLine.close();
        process.exit(0);
      }
    });
  } else {
    const numWorkers = process.env.numWorkers
      ? parseInt(process.env.numWorkers)
      : 1;
    const numCalls = process.env.numCalls ? parseInt(process.env.numCalls) : 1;

    //Worker Cluster process
    if (isMainThread) {
      //Main thread - set up worker threads
      let activeWorkers = 0;

      for (let i = 0; i < numWorkers; i++) {
        activeWorkers++;
        const worker = new Worker(__filename, { workerData: { numCalls } });
        //listen for messages from the worker and errors
        worker.on('message', (msg) => {
          console.log(msg);
        });
        worker.on('exit', (code) => {
          if (code !== 0) new Error(`Worker stopped with exit code ${code}`);
          activeWorkers--;
          if (activeWorkers === 0) {
            process.exit(0);
          }
        });
      }
    } else {
      const { numCalls } = workerData;
      let counter = 0;
      //Worker thread
      //this is where code for the worker thread goes
      //code for sending calls to grpc server
      const PORT = 8082;
      const PROTO = '../proto/helloworld.proto';

      const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO));
      const grpcObj = grpc.loadPackageDefinition(
        packageDef
      ) as unknown as ProtoGrpcType;
      const greeterPackage = grpcObj.greeterPackage;

      const client = new grpcObj.greeterPackage.Greeter(
        `0.0.0.0:${PORT}`,
        grpc.credentials.createInsecure()
      );

      let clientInterceptor = new MetricInterceptor();

      let runStub = () => {
        client.SayHello(
          { name: 'Kenny' },
          { interceptors: [clientInterceptor.interceptor] },
          (err, res) => {
            if (err) {
              console.log('error', err);
              return;
            }
            console.log('result:', res);
          }
        );
      };

      // let counter = 0;
      let copy = function () {
        counter++;
        if (counter < numCalls) {
          setTimeout(() => {
            copy();
          }, 1);
        }
        runStub();
      };

      copy();

      setTimeout(() => {
        console.log('Finished calls: ', clientInterceptor.numCalls);
        console.log('Number of failed requests: ', clientInterceptor.numErrors);
      }, 2000);
    }

    //close the prompt
    readLine.close();
  }
}
main().catch((err) => {
  console.error('An error occured: ', err);
  process.exit(1);
});
