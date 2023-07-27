const { collectDefaultMetrics, register, Counter, Histogram, Summary } = require('prom-client')
const express = require('express')
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
const app = express()
const PORT = 9090;
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.end(metrics);
});
app.listen(PORT, () => console.log(`Prometheus metrics server listening on ${PORT}`))


collectDefaultMetrics()
function observeDurationHistogram(methodName) {

  const startTime = process.hrtime();
  const endTime = process.hrtime(startTime);
  const durationInSeconds = endTime[ 0 ] + endTime[ 1 ] / 1e9;
  grpcMethodDurationHistogram.observe({ method: methodName }, durationInSeconds);
  grpcRequestCounter.increment(methodName)
  grpcMethodLatencySummary.observe({ method: methodName }, durationInSeconds)
  return
}

// module.exports = observeDurationHistogram;