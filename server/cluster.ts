const cluster = require('cluster');
const os = require('os');
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

/**
 * Data Storage Metrics
 */
let cpuUsageData = [];
let eluData = [];
let totalWorkers = 0;
let exitedWorkers = 0;

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

export default async function loadT() {
  //create a client server with num clusters and worker threads on each cluster
  if (cluster.isPrimary && isMainThread) {
    console.log(
      `This is the gRPSeek Load Balance Tester! The tester requires you to input the number of concurrent processes you'd like to run to simulate a grpc server load.`
    );
    console.log(`
    ██████╗  ██████╗ ██████╗ ███████╗███████╗███████╗██╗  ██╗
    ██╔════╝ ██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝██║ ██╔╝
    ██║  ███╗██████╔╝██████╔╝███████╗█████╗  █████╗  █████╔╝
    ██║   ██║██╔══██╗██╔═══╝ ╚════██║██╔══╝  ██╔══╝  ██╔═██╗
    ██████╔╝ ██║  ██║██║     ███████║███████╗███████╗██║  ██╗
     ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝
   `);

    const { numClusters, numWorkers, numCalls } = await gatherInputs();

    //Main process - set up cluster workers
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numClusters; i++) {
      cluster.fork({ numWorkers, numCalls });
    }
    cluster.on('online', (worker) => {
      console.log(`worker ${worker.process.pid} is forked and running`);
    });
    // Initialize total number of worker processes assuming each cluster forks one worker
    totalWorkers = numClusters;
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      exitedWorkers++;
      // if (Object.keys(cluster.workers).length === 0) {
      //   // All workers have exited, close readLine and exit
      //   readLine.close();
      //   process.exit(0);
      // }
      if (exitedWorkers >= totalWorkers) {
        // Write the metrics data to files
        const fs = require('fs');
        fs.writeFileSync('cpuUsageData.json', JSON.stringify(cpuUsageData));
        fs.writeFileSync('eluData.json', JSON.stringify(eluData));

        // All workers have exited, close readLine and exit
        readLine.close();
        process.exit(0);
      }
    });
    cluster.on('message', (worker, message, handle) => {
      if (message.type === 'CPU') {
        cpuUsageData.push(message.data);
      } else if (message.type === 'ELU') {
        eluData.push(message.data);
      }
    });
  } else {
    const numWorkers = process.env.numWorkers
      ? parseInt(process.env.numWorkers)
      : 1;
    const numCalls = process.env.numCalls ? parseInt(process.env.numCalls) : 1;

    //Worker Cluster process
    if (isMainThread) {
      let lastMeasure = os.cpus();

      setInterval(() => {
        const currentMeasure = os.cpus();

        for (let i = 0; i < currentMeasure.length; i++) {
          const idleDifference =
            currentMeasure[i].times.idle - lastMeasure[i].times.idle;
          const totalDifference = Object.keys(currentMeasure[i].times).reduce(
            (total, mode) => {
              return (
                total +
                currentMeasure[i].times[mode] -
                lastMeasure[i].times[mode]
              );
            },
            0
          );
          const cpuUsage = (1 - idleDifference / totalDifference) * 100;

          console.log(
            `CPU${i} Usage: ${(1 - idleDifference / totalDifference) * 100}%`
          );
        }

        lastMeasure = currentMeasure;
      }, 1000);

      //Main thread - set up worker threads
      let activeWorkers = 0;

      for (let i = 0; i < numWorkers; i++) {
        activeWorkers++;
        const worker = new Worker(__filename, { workerData: { numCalls } });
        setInterval(() => {
          const currentMeasure = os.cpus();

          for (let i = 0; i < currentMeasure.length; i++) {
            const idleDifference =
              currentMeasure[i].times.idle - lastMeasure[i].times.idle;
            const totalDifference = Object.keys(currentMeasure[i].times).reduce(
              (total, mode) => {
                return (
                  total +
                  currentMeasure[i].times[mode] -
                  lastMeasure[i].times[mode]
                );
              },
              0
            );
            const cpuUsage = (1 - idleDifference / totalDifference) * 100;
            process.send({ type: 'CPU', data: cpuUsage });
          }
          // Check the worker's usage directly and immediately. The call is thread-safe
          // so it doesn't need to wait for the worker's event loop to become free.

          process.send({
            type: 'ELU',
            data: worker.performance.eventLoopUtilization(),
          });
          // console.log(worker.performance.eventLoopUtilization());
        }, 100);

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
      const PORT = 50051;
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
loadT().catch((err) => {
  console.error('An error occured: ', err);
  process.exit(1);
});
