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
// const client = require('prom-client');
// const Registry = client.Registry;
// const register = new Registry();
collectDefaultMetrics();
// ============Creating custom metrics for gRPC ==================
const grpcRequestCounter = new Counter({
  name: 'grpc_server_requests_total',
  help: 'Total number of gRPC requests received',
  labelNames: ['method'],
  // registers: [register],
});
const grpcMethodDurationHistogram = new Histogram({
  name: 'grpc_server_method_duration_seconds',
  help: 'Duration of gRPC methods in seconds',
  labelNames: ['method'],
  // buckets: [ 0.1, 0.5, 1, 2, 5 ],
  buckets: [
    0.0000001, 0.0000005, 0.000001, 0.0000015, 0.000002, 0.000003, 0.000004,
    0.000005,
  ],

  // registers: [register],
});

const grpcMethodLatencySummary = new Summary({
  name: 'grpc_server_method_latency_seconds',
  help: 'Latency of gRPC methods in seconds',
  labelNames: ['method'],
  percentiles: [0.1, 0.3, 0.4, 0.5, 0.9, 0.99],
  // registers: [register],
});
const grpcRequestSizeHistogram = new Histogram({
  name: 'grpc_server_request_size_bytes',
  help: 'Size of incoming gRPC requests in bytes',
  labelNames: ['method'],
  buckets: [100, 500, 1000, 2000],
  // registers: [register],
});

// =====================================================
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  console.log('Received a Request: ', call.request.name);

  //====================== Implementing Custom Metrics ==========================
  grpcRequestCounter.inc({ method: 'sayHello' }); // Increment the request counter
  //============= Measure the method duration=================
  const startTime = process.hrtime();
  const endTime = process.hrtime(startTime);
  const durationInSeconds = endTime[0] + endTime[1] / 1e9;

  const requestSizeBytes = Buffer.byteLength(JSON.stringify(call.request));
  // ======================================================
  grpcMethodDurationHistogram.observe(
    { method: 'sayHello' },
    durationInSeconds
  );
  grpcMethodLatencySummary.observe({ method: 'sayHello' }, durationInSeconds);
  grpcRequestSizeHistogram.observe({ method: 'sayHello' }, requestSizeBytes);

  // ============ RESPONSE FROM gRPC SERVER ==================

  const response = { message: 'Hello from Server' };
  callback(null, response);
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
    sayHelloAgain: sayHelloAgain,
  });
  server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log('gRPC server started on: 0.0.0.0:50051');
    }
  );
}
// ========== Prometheus/Express ===========

const PORT = 3500;
const cors = require('cors');
app.use(cors());
app.use('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  const metrics = await register.getMetricsAsJSON();
  res.header('Access-Control-Allow-Origin', '*');
  res.status(200).json(metrics);
});

app.listen(PORT, () =>
  console.log(`Prometheus metrics server listening on ${PORT}`)
);
main();
