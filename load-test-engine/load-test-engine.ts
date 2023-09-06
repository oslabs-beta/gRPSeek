const hash = require('crypto');
import MetricInterceptor from '../server/loadTester';
import * as grpc from '@grpc/grpc-js';

// Generates a label if one is not provided by user
function hashCall(stub: Stub, message: Message, interval: number) {
  return hash.createHash('sha256')
    .update(stub.toString() + JSON.stringify(message) + interval.toString())
    .digest('hex');
}

// Recursive setTimeout for repeating calls
function repeatCall(call: Call) {
  // Type issue with grpc.CallOptions, temporarily disabling call count limit
  // if (call.options.interceptors !== undefined && call.count >= call.options.interceptors[0].numCalls) {
  //   clearTimeout(call.timeout);
  //   return;
  // }
  call.stub(call.message, call.options, call.callback);
  call.timeout = setTimeout(() => {repeatCall(call)}, call.interval);
}

type Stub = (message: Message, options: grpc.CallOptions, callback: grpc.requestCallback<any>) => any;

type Message = Record<string, string | number | boolean>;

type Call = {
  stub: Stub,
  message: Message,
  options: grpc.CallOptions,
  callback: grpc.requestCallback<any>,
  interval: number,
  count: number,
  timeout: NodeJS.Timeout | undefined,
}

class LoadTestEngine {
  private calls: Record<string, Call>
  private active: Record<string, Call>
  
  constructor() {
    this.calls = {};
    this.active = {};
  }

  addCall(
    stub: Stub,
    message: Message,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<any>,
    interval: number,
    count: number = Infinity,
    label: string = hashCall(stub, message, interval),
    timeout: NodeJS.Timeout | undefined,
  ): LoadTestEngine {
    if (this.calls[label]) {
      throw new Error('Label already exists.');
    }
    this.calls[label] = {
      stub,
      message,
      options,
      callback,
      interval,
      count,
      timeout,
    }
    console.log(`Call ${label} added.`);
    return this;
  }

  removeCall(label: string): LoadTestEngine {
    if (this.calls[label]) {
      delete this.calls[label];
      console.log(`Call ${label} removed`);
      return this;
    } else {
      throw new Error('Label does not exist.')
    }
  }

  getLabels(): Array<string> {
    return Object.keys(this.calls);
  }

  start(labels: Array<string>): void {
    labels.forEach((label) => {
      // Check that call is not already active
      if (!this.active[label]) {
        // The associated this.calls object for the current label
        const call = this.calls[label];
        // Set a recursive timeout
        console.log(`Call ${label} started.`);
        repeatCall(call);
        // Add to active calls tracker
        this.active[label] = call;
      }
    })
  }

  startAll(): void {
    console.log(`Starting all calls.`);
    for (const label in this.calls) {
      if (!this.active[label]) {
        const call = this.calls[label];
        console.log(`Call ${label} started.`);
        repeatCall(call);
        this.active[label] = call;
      }
    }
  }

  stop(labels: Array<string>): void {
    labels.forEach((label) => {
      clearTimeout(this.active[label].timeout);
      delete this.active[label];
      console.log(`Call ${label} stopped.`);
    })
  }

  stopAll(): void {
    if (!Object.keys(this.active).length) {
      throw new Error('No active calls.')
    }
  
    for (const label in this.active) {
      clearTimeout(this.active[label].timeout);
      delete this.active[label];
      console.log(`Call ${label} stopped.`);
    }
    console.log('All active calls stopped.');
  }

}

module.exports = new LoadTestEngine();