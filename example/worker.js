const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const timer = require('../gRPSeek-Package/index')
const file = '../example/greeter_client.js'

// Load the protobuf definition
const packageDefinition = protoLoader.loadSync('./protos/helloworld.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

// Create a gRPC client
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld
const client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
// Function to make gRPC requests
async function makeGrpcRequest(requestPayload, clientMethod) {
  // Call the gRPC method
  return new Promise((resolve, reject) => {
    // console.log("CLIENT SAY HELLO: ", client)
    console.log("TYPE:", typeof client.sayHello)
    client.sayHello(requestPayload, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
// Main execution function
async function run(requestPayload, clientMethod) {
  try {
    const response = await makeGrpcRequest(requestPayload, clientMethod);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // You can add any cleanup or additional logic here
    console.log('Done')
  }
}

timer(file, 10, 5)

