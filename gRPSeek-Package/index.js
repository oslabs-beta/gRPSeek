const { Worker } = require('worker_threads');

//function to create new instances of worker threads
function createWorkers(method) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(method);
    worker.on('message', (message) => {
      console.log('worker message', message)
    });
    worker.on('error', (error) => {
      reject(error);
    });
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`worker stopped with exit code ${code}`))
      }
    });
    resolve(worker);
  });
}

//sleep will be optional

function runTest(method, vu) {
  console.log(`Creating ${vu} virtual users`)
  //create desired workers
  const workerArr = [];
  while (vu > 0) {
    workerArr.push(createWorkers(method));
    vu--;
  }
  console.log(` Sending gRPC requests...`);

  // const seconds = duration * 1000;
  Promise.all(workerArr).then(result =>  result);

}

function loadTest(filepath, vu, seconds) {
  console.log(`timer: ${filepath}, vu: ${vu}`)
  seconds *= 1000;
  const id = setInterval(() => {
    runTest(filepath, vu)
    console.log(`setInterval: method: ${filepath}, vu: ${vu}`)
  }, 0)
  setTimeout(() => clearInterval(id), seconds)
}

module.exports = loadTest;