import * as path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../proto/helloworld';
import { GreeterHandlers } from '../proto/greeterPackage/Greeter';
import { addReflection } from 'grpc-server-reflection';
let numCalls = 0;
const PORT = 8082;
const PROTO_FILE = '../proto/helloworld.proto';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(
  packageDef
) as unknown as ProtoGrpcType;
const greeterPackage = grpcObj.greeterPackage;
const DESCRIPTOR_PATH = path.resolve(__dirname, '../proto/descriptor_set.bin');

function main() {
  const server = getServer();

  addReflection(server, DESCRIPTOR_PATH);
  const serverCredentials = grpc.ServerCredentials.createInsecure();
  server.bindAsync(`0.0.0.0:${PORT}`, serverCredentials, (err, port) => {
    if (err) {
      console.log('Error: ', err);
      return;
    }
    console.log(`Your server has started on port ${port}`);
    server.start();
  });
}

function getServer() {
  const server = new grpc.Server();

  server.addService(greeterPackage.Greeter.service, {
    SayHello: (call, callback) => {
      console.log('Server received request: ', call.request);
      console.log(numCalls++);
      if (!call.request.name) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Invalid arg from server (SayHello)',
        });
      } else {
        callback(null, { message: 'Hello from server' });
      }
    },
    SayHelloAgain: (call, callback) => {
      // console.log("Server received request: ", req.request);
      let value = Math.floor(Math.random() * 10);
      if (value < 2) {
        callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Invalid arg from server (SayHelloAgain)',
        });
      } else {
        callback(null, { message: 'Hello again from server' });
      }
    },
  } as GreeterHandlers);

  return server;
}
main();
