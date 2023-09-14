const hash = require('crypto');
import MetricInterceptor from '../server/loadTester';
import * as grpc from '@grpc/grpc-js';
import * as path from 'path';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../proto/helloworld';
let clientInterceptor = new MetricInterceptor();
const options = { interceptors: [clientInterceptor.interceptor] }

// Generates a label if one is not provided by user
function hashCall(stub: Stub, message: Message, interval: number) {
  return hash.createHash('sha256')
    .update(stub.toString() + JSON.stringify(message) + interval.toString())
    .digest('hex');
}
function findService(grpcObject: any, serviceName: string): any {
  console.log(`Searching for service ${serviceName}...`);
  
  if (grpcObject[serviceName]) {
    console.log(`Service ${serviceName} found at current level.`);
    return grpcObject[serviceName];
  }
  
  for (const key in grpcObject) {
    if (typeof grpcObject[key] === 'object') {
      console.log(`Descending into ${key}...`);
      const nestedService = findService(grpcObject[key], serviceName);
      if (nestedService) {
        console.log(`Service ${serviceName} found in ${key}.`);
        return nestedService;
      }
    }
  }

  console.log(`Service ${serviceName} not found.`);
  return null;
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
export interface LoadTestConfig {
  duration: number,
  protoPath?: string,
  serviceName?: string,
  methodName?: string,
  payloadPath?: string,
  callbackPath?: string,
  // ... other configurations
}
export class LoadTestEngine {
  private calls: Record<string, Call>;
  private active: Record<string, Call>;
  public config: LoadTestConfig;
  
  constructor(config: LoadTestConfig) {
    this.config = config;
    this.calls = {};
    this.active = {};
    if (config.protoPath && config.serviceName && config.methodName) {
      this.setupGrpcClient();
    }
  }
  public setupGrpcClient() {
    
    const packageDef = protoLoader.loadSync(path.resolve(__dirname, this.config.protoPath));
    const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType;
    // console.log("grpcObject: ", grpcObj);

    // const Pkg = grpcObj[this.config.serviceName] ;
    const Pkg = findService(grpcObj, this.config.serviceName ?? '');

    if (!Pkg) {
      throw new Error(`Service "${this.config.serviceName}" not found in the loaded .proto file.`);
    }
    
    // console.log(typeof Pkg);
    // console.log("Package: ______", Pkg);
    // const client =  (new Pkg[this.config.methodName](this.config.protoPath, grpc.credentials.createInsecure())); 
    const client =  new Pkg[this.config.methodName]('localhost:50051', grpc.credentials.createInsecure()); // Replace with your server details


    // Assuming unary call for simplicity; you may need to handle different types of calls
    const stub: Stub = (message, options, callback) => {
      
      // Implement the actual gRPC call here using service and methodName
      //  return this.config.serviceName[this.config.methodName]console.log('Inspecting client object:', client);
      console.log('Method name:', this.config.methodName);
      console.log('Is method a function?', typeof client[this.config.methodName] === 'function');
      client[this.config.methodName](message, callback)

   
     };
     
   
    // Load custom payload and callback if provided
    const payload = this.config.payloadPath ? require(this.config.payloadPath) : {};
    const callback: grpc.requestCallback<any> = this.config.callbackPath ? require(this.config.callbackPath) : (err: any, res: any) => {};
    const options: grpc.CallOptions = {};
    const interval: number = 1000;

    this.addCall(stub, payload, options, callback, interval);
  }
  // Overload signatures
  addCall(stub: Stub, message: Message, options: grpc.CallOptions, callback: grpc.requestCallback<any>, interval: number): LoadTestEngine;
  addCall(stub: Stub, message: Message, options: grpc.CallOptions, callback: grpc.requestCallback<any>, interval: number, count: number, label: string, timeout: NodeJS.Timeout): LoadTestEngine;
  

  addCall(
    stub: Stub,
    message: Message,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<any>,
    interval: number,
    count?: number,
    label?: string ,
    timeout?: NodeJS.Timeout | undefined,
  ): LoadTestEngine {
    if (this.calls[label]) {
      throw new Error('Label already exists.');
    }
    if (arguments.length < 8) {
      timeout = undefined;
    }
    if (arguments.length < 7) {
      label = hashCall(stub, message, interval);
    }
    if (arguments.length < 6) {
      count = Infinity;
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

  public run() {
    this.startAll();
    setTimeout(() => {
      this.stopAll();
      // Generate HTML or other reports here
    }, this.config.duration * 1000);
  }
}

// module.exports = new LoadTestEngine();
export const loadTestEngineInstance = new LoadTestEngine({ duration: 10000 }); // example duration
