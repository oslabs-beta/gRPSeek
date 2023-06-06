# gRPSeek
[![npm version](https://badge.fury.io/js/grpseek.svg)](https://badge.fury.io/js/grpseek)
![Version](https://img.shields.io/npm/vnpm/gRPSeek)
![License](https://img.shields.io/npm/l/gRPSeek)
![Downloads](https://img.shields.io/npm/dt/gRPSeek)


gRPSeek is a powerful npm package that allows you to perform load testing for gRPC services using worker threads in Node.js. It provides a straightforward and efficient way to simulate high traffic scenarios and evaluate the performance of your gRPC services under heavy load.

## Features

- Load test gRPC services with ease
- Utilizes worker threads for parallel execution
- Adjustable request rate and concurrency levels
- Detailed statistics and performance metrics
- Comprehensive error reporting
- Flexible configuration options
- Simple and intuitive API

## Installation

You can install gRPSeek using npm:

```
npm install gRPSeek
```
# Statistics and Metrics
gRPSeek provides detailed statistics and performance metrics to help you analyze the load test results. The result object returned by the load test contains the following properties:

- totalRequests: Total number of requests made
- totalErrors: Total number of failed requests
- totalDuration: Total duration of the load test in milliseconds
- requestsPerSecond: Average number of requests per second
- meanLatency: Mean latency of the requests in milliseconds
- p50Latency: 50th percentile latency value in milliseconds
- p90Latency: 90th percentile latency value in milliseconds
- p95Latency: 95th percentile latency value in milliseconds
- p99Latency: 99th percentile latency value in milliseconds
- maxLatency: Maximum latency value in milliseconds


## License
This package is distributed under the MIT License. See the LICENSE file for more information.

## Contributing
Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request on the GitHub repository.

## Credits
gRPSeek is developed and maintained by OSLabs