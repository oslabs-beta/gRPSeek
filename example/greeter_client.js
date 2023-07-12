const path = require('path')
//const PROTO_PATH = __dirname + '/protos/helloworld.proto';
const PROTO_PATH = path.join(__dirname ,'/protos/helloworld.proto');


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

function main() {
  const client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
  client.sayHello({ name: 'Kenny' }, function (err, response) {
    console.log('sayHello Greetings:', response.message);
  });
  client.sayHelloAgain({ name: 'Miri' }, function (err, response) {
    console.log('sayHelloAgainGreetings:', response.message)
  })
  invoke()
}

function invoke() {
  const client2 = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
  client2.sayHello({ name: 'Miri' }, function (err, response) {
    console.log('clientGreetings:', response.message);
  });
}

main()




