import * as path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../proto/helloworld';
import MetricInterceptor from '../server/loadTester';
const LTE = require('../load-test-engine/load-test-engine');

const PORT = 8082;
const PROTO = '../proto/helloworld.proto';

// process.env.GRPC_TRACE = 'api,channel';
// process.env.GRPC_VERBOSITY = 'DEBUG';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO), {});
const grpcObj = grpc.loadPackageDefinition(
  packageDef
) as unknown as ProtoGrpcType;
const greeterPackage = grpcObj.greeterPackage;

const client = new greeterPackage.Greeter(
  `0.0.0.0:${PORT}`,
  grpc.credentials.createInsecure()
);
console.log('CLIENT: ', client);
let clientInterceptor = new MetricInterceptor();

// Arguments to be passed into each RPC
const message = { name: 'Kenny' };

const options = { interceptors: [clientInterceptor.interceptor] };

const callback = (err: any, res: any) => {
  if (err) {
    console.log('error', err);
    return;
  }
  console.log('result:', res);
};

// Iterate through client and add RPCs to engine, ignoring duplicate (Pascal case) versions of the RPCs.
for (const key in client) {
  if (key[0] >= 'a' && key[0] <= 'z') {
    const stub = (client as any)[key] as Function;
    LTE.addCall(
      stub.bind(client),
      message,
      options,
      callback,
      1000,
      undefined,
      'TestCall:' + key
    );
  }
}

// Start load testing
LTE.startAll();

// Stop load testing after 10 seconds
setTimeout(() => {
  LTE.stopAll();
}, 10000);
