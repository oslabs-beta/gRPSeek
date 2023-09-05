import * as path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../proto/helloworld';
import MetricInterceptor from '../server/loadTester';

const PORT = 8082;
const PROTO = '../proto/helloworld.proto';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO));
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType;
const greeterPackage = grpcObj.greeterPackage;

const client = new grpcObj.greeterPackage.Greeter(
  `0.0.0.0:${PORT}`, grpc.credentials.createInsecure(),
)

let clientInterceptor = new MetricInterceptor();

function main() {
  client.SayHello({ name: "Kenny" }, { interceptors: [clientInterceptor.interceptor] }, (err, res) => {
    if (err) {
      console.log('error', err)
      return;
    }
    console.log("result:", res)
  })
}

for (let i = 0; i < 100; i++) {
  main();
}
console.log('Finished calls: ', clientInterceptor.numCalls);
console.log('Number of failed requests: ', clientInterceptor.numErrors);
