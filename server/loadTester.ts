import * as grpc from '@grpc/grpc-js';
import { performance } from 'perf_hooks';
import * as fs from 'fs';
import * as path from 'path';
import { generateHTML } from '../utils/generateHTML';

interface MetricInterceptorInterface {
  numCalls: number;
  numErrors: number;
  interceptor: grpc.Interceptor;
  getNumCalls: () => number;
  getNumErrors: () => number;
  resetMetrics: () => void;
  generateHTMLReport: () => void;
}

class MetricInterceptor implements MetricInterceptorInterface {
  numCalls: number;
  numErrors: number;
  // Class-level array to store latency data
  latencyData: any[];

  constructor() {
    this.numCalls = 0;
    this.numErrors = 0;
    this.latencyData = [];
  }

  interceptor: grpc.Interceptor = (options, nextCall) => {
    let startTime: number;
    let endTime: number;
    // Create a requestor intercepts outbound operations (start, sendMessage)
    let requestor: grpc.Requester = {
      // Start method called before an outbound call has started. This is where to define listener and methods that occur with inbound operations
      start: (metadata, listener, next) => {
        // Listener that intercepts inbound operations - receiving server status and message
        let newListener: grpc.Listener = {
          onReceiveMessage: (message, next) => {
            console.log('inbound message received: ', message);
            let endTime = performance.now();
            let timeDuration = endTime - startTime;

            this.latencyData.push({
              requestNumber: this.numCalls,
              latency: timeDuration,
            });
            next(message);
          },
          onReceiveStatus: (status, next) => {
            if (status.code !== grpc.status.OK) {
              this.numErrors++;
              console.log(
                `status error: ${grpc.status[status.code]} message: ${
                  status.details
                }, ${this.numErrors}, ${this.numCalls}`
              );
            }
            next(status);
          },
        };
        next(metadata, newListener);
      },
      //sendMesssage method called before every outbound message - where we count total number of calls, time start
      sendMessage: (message, next) => {
        console.log('outbound message sent: ', message);
        startTime = performance.now();
        this.numCalls++;
        console.log(this.numCalls);
        next(message);
      },
    };

    const call = new grpc.InterceptingCall(nextCall(options), requestor);
    return call;
  };

  generateHTMLReport(): void {
    generateHTML(this.latencyData);
  }
  getNumCalls: () => number = () => this.numCalls;
  getNumErrors: () => number = () => this.numErrors;
  resetMetrics: () => void = () => {
    this.numCalls = 0;
    this.numErrors = 0;
  };
}

export default MetricInterceptor;
