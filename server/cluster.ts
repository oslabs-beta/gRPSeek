import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';
import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';

const PORT = 8082;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const readLine = readline.createInterface({ input, output });
const numCPUs = availableParallelism();

async function inputQuery(label: string, question: string, errorMsg: string = `Input was not a number`): Promise<number> {
  let numInput = parseInt(await readLine.question(`${question}\n`));
  while (isNaN(numInput)) {
    console.log(`\x1b[91m \nERROR: ${errorMsg}. Please try again.\x1b[0m`);
    numInput = parseInt(await readLine.question(`${question}\n`));
  }
  console.log(`\n${label} Input: ${numInput}`);
  return numInput;
}

async function main() {
  console.log(`This is the gRPSeek Load Balance Tester! The tester requires you to input the number of concurrent processes you'd like to run to simulate a grpc server load.`);

  //ask for how many cluster based on cores
  const numClusters = await inputQuery(`NumClusters`, `How many clusters? Number of CPUs: ${numCPUs}`);

  //ask for how many worker threads
  const numWorkers = await inputQuery(`NumWorkers`, `How many worker threads?`);

  //ask for length of time / # of calls to the server wanted
  const numCalls = await inputQuery(`NumCalls`, `How many calls to the server?`);

  //create a client server with that many cluster and worker threads on it
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numClusters; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    // Workers can share any TCP connection
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.listen(PORT, () => {
      console.log(`Worker ${process.pid}, Server listening on port: ${PORT}...`);
    });
  }

  //close the prompt
  readLine.close();
}

main();