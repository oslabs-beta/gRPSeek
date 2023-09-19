// import * as grpc from '@grpc/grpc-js';
// import * as protoLoader from '@grpc/proto-loader';
// import { ProtoGrpcType } from '../proto/helloworld';
// import { GreeterClient } from '../proto/greeterPackage/Greeter';
// import { HelloRequest } from '../proto/greeterPackage/HelloRequest';
// import { HelloReply } from '../proto/greeterPackage/HelloReply';

// const PROTO_FILE = '../proto/helloworld.proto';
// const PORT = '0.0.0.0:8082';

// // Load proto files
// const packageDef = protoLoader.loadSync(PROTO_FILE);
// const grpcObj = grpc.loadPackageDefinition(
//   packageDef
// ) as unknown as ProtoGrpcType;

// // Create a new gRPC client
// const greeterClient = new grpcObj.greeterPackage.Greeter(
//   PORT,
//   grpc.credentials.createInsecure()
// ) as unknown as GreeterClient;

// describe('gRPC Server', () => {
//   it('should handle SayHello RPC', (done) => {
//     const request: HelloRequest = { name: 'John' };

//     greeterClient.sayHello(request, (error, response: HelloReply) => {
//       expect(error).toBe(null);
//       expect(response.message).toBe('Hello from server');
//       done();
//     });
//   });

//   it('should handle SayHelloAgain RPC', (done) => {
//     const request: HelloRequest = { name: 'John' };

//     greeterClient.sayHelloAgain(request, (error, response: HelloReply) => {
//       expect(error).toBe(null);
//       expect(response.message).toBe('Hello again from server');
//       done();
//     });
//   });

//   it('should return error for invalid SayHello request', (done) => {
//     const request: HelloRequest = { name: '' };

//     greeterClient.sayHello(request, (error) => {
//       expect(error).not.toBe(null);
//       expect(error?.code).toBe(grpc.status.INVALID_ARGUMENT);
//       done();
//     });
//   });
// });
