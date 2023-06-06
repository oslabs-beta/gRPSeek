
// ============== gRPC MODULES ====================
const PROTO_PATH = __dirname + '/protos/helloworld.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// const grpcHist = require('../gRPSeek-Package/metrics')
// ============= EXPRESS =======================
const express = require('express');
const app = express();

// =========== PROMETHEUS ============================
const { collectDefaultMetrics, register } = require('prom-client');
const { Counter, Histogram, Summary } = require('prom-client'); // Custom Metrics 
collectDefaultMetrics()

// ============Creating custom metrics for gRPC ==================
const grpcRequestCounter = new Counter({
  name: 'grpc_server_requests_total',
  help: 'Total number of gRPC requests received',
  labelNames: [ 'method' ],
});
const grpcMethodDurationHistogram = new Histogram({
  name: 'grpc_server_method_duration_seconds',
  help: 'Duration of gRPC methods in seconds',
  labelNames: [ 'method' ],
  buckets: [ 0.1, 0.5, 1, 2, 5 ],
});
const grpcMethodLatencySummary = new Summary({
  name: 'grpc_server_method_latency_seconds',
  help: 'Latency of gRPC methods in seconds',
  labelNames: [ 'method' ],
  percentiles: [ 0.1, 0.3, .4, 0.5, 0.9, 0.99 ],
});
const grpcRequestSizeHistogram = new Histogram({
  name: 'grpc_server_request_size_bytes',
  help: 'Size of incoming gRPC requests in bytes',
  labelNames: [ 'method' ],
  buckets: [ 100, 500, 1000, 2000 ],
});

// =====================================================
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

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  //console.log('Received a Request: ', call.request.name)

  //====================== Implementing Custom Metrics ==========================
  grpcRequestCounter.inc({ method: 'sayHello' }); // Increment the request counter
  //============= Measure the method duration=================
  const startTime = process.hrtime();
  const endTime = process.hrtime(startTime);
  const durationInSeconds = endTime[ 0 ] + endTime[ 1 ] / 1e9;
  // ======================================================
  grpcMethodDurationHistogram.observe({ method: 'sayHello' }, durationInSeconds);
  grpcMethodLatencySummary.observe({ method: 'sayHello' }, durationInSeconds);



  // ============ RESPONSE FROM gRPC SERVER ==================


  const response = { message: 'Hello from Server' }
  callback(null, response)
  // =================================================
}
// 
function sayHelloAgain(call, callback) {
  callback(null, { message: 'Hello again, ' + call.request.name });
}
/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  const server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {
    sayHello: sayHello,
    sayHelloAgain: sayHelloAgain
  });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('gRPC server started on: 0.0.0.0:50051')
  });
}
// ========== Prometheus/Express ===========

const PORT = 9090;
const cors = require('cors');
app.use(cors())
app.use('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  const metrics = await register.getMetricsAsJSON();
  res.header('Access-Control-Allow-Origin', '*');
  res.send(metrics);
});

app.listen(PORT, () => console.log(`Prometheus metrics server listening on ${PORT}`))
main();
