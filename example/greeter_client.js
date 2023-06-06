/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const PROTO_PATH = __dirname + '/protos/helloworld.proto';

const parseArgs = require('minimist');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

// function main() {
//   const argv = parseArgs(process.argv.slice(2), {
//     string: 'target'
//   });
//   const target;
//   if (argv.target) {
//     target = argv.target;
//   } else {
//     target = 'localhost:50051';
//   }
//   const client = new hello_proto.Greeter(target,
//     grpc.credentials.createInsecure());
//   const user;
//   if (argv._.length > 0) {
//     user = argv._[ 0 ];
//   } else {
//     user = 'world';
//   }
//   client.sayHello({ name: user }, function (err, response) {
//     console.log('Greeting:', response.message);
//   });
// }
function main() {
  const client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
  client.sayHello({ name: 'Kenny' }, function (err, response) {
    console.log('sayHello Greetings:', response.message);
  });
  client.sayHelloAgain({ name: 'Miri' }, function (err, response) {
    console.log('sayHelloAgainGreetings:', response.message)
  })
}

function invoke() {
  const client2 = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
  client2.sayHello({ name: 'Miri' }, function (err, response) {
    console.log('clientGreetings:', response.message);
  });
}
main()
// module.exports = invoke;

// function startLoopWithTimer() {
//   const startTime = new Date()
//   console.log("START:", startTime)
//   let counter = 0;
//   const intervalId = setInterval(() => {
//     // Perform your desired actions inside the loop
//     main()
//     counter++;

//     // Once 20 iterations happen 
//     if (counter === 30) {
//       clearInterval(intervalId);
//       const endTime = new Date();
//       console.log(endTime);
//       const duration = (endTime - startTime) / 1000;
//       // Moves it over 2 decimal places pretty kool
//       console.log(`Elapsed time: ${duration.toFixed(2)} seconds`);

//       console.log(`Loop stopped after ${counter} iterations`);
//     }
//   }, 1000); // Set the interval duration (in milliseconds)
// }

// // Start the loop with a timer
// startLoopWithTimer();


// // main();

// // Testing the function invocation 10 times back to back 
// // const startTime = new Date()
// // console.log("START: ", startTime)
// // main()
// // main()
// // main()
// // main()
// // main()
// // main()
// // main()
// // main()
// // main()
// // main()
// // main()
// // const endTime = new Date();
// // const duration = (endTime - startTime) / 1000;
// // console.log(`Elapsed time: ${duration.toFixed(2)} seconds`);


