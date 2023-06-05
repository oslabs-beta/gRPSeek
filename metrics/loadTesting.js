const {Worker} = require('worker_threads');


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
            if(code !== 0) {
                reject(new Error(`worker stopped with exit code ${code}`))
            }
        });
        resolve(worker);
    });
 }
                                                                                                                                                                                          

//sleep will be optional
export function loadTest(method, vu, duration, sleep) {
    //create desired workers
    const workerArr = [];
    while(vu > 0) {
        workerArr.push(createWorkers(method));
    }
    console.log(`Created ${vu} virtual users. Sending gRPC requests...`)

    Promise.all(workerArr).then(result => console.log(result))
}

