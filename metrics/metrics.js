const {collectDefaultMetrics, Counter, Histogram, Summary, register} = require('prom-client');

const grpcRequestCounter = new Counter({
    name: 'grpc_server_request_total',
    help: "Total number of gRPC requests received",
    labelNames: ['method']
});

const grpcMethodDurationHistogram = new Histogram({
    name: 'grpc_server_method_duration_seconds',
    help: 'Duration of gRPC methods in seconds',
    labelNames: ['method'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

const grpcMethodLatencySummary = new Summary({
    name: 'grpc_server_method_latency_seconds',
    help: 'Latency of gRPC methods in seconds',
    labelNames: ['method'],
    percentiles: [0.1, 0.3, 0.4, 0.5, 0.9, 0.99]
});

const grpcRequestSizeHistogram = new Histogram({
    name: 'grpc_server_request_size_bytes',
    help: 'Size of incoming gRPC requests in bytes',
    labelNames: ['method'],
    buckets: [100, 500, 1000, 2000]
})