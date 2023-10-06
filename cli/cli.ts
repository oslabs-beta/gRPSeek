#!/usr/bin/env node

// process.env.GRPC_NODE_TRACE = 'api,channel';
// process.env.GRPC_NODE_VERBOSITY = 'DEBUG';
import { program } from 'commander';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import {
  LoadTestEngine,
  LoadTestConfig,
} from '../load-test-engine/load-test-engine';
import MetricInterceptor from '../server/loadTester';
// import { generateHTML } from '../utils/generateHTML';
import loadT from '../server/cluster';

let clientInterceptor = new MetricInterceptor();
const otherOptions = { interceptors: [clientInterceptor.interceptor] };
// function findService(
//   grpcObject: Record<string, any>,
//   serviceName: string
// ): Record<string, any> | null {
//   console.log(`Searching for service ${serviceName}...`);

//   if (grpcObject[serviceName]) {
//     console.log(`Service ${serviceName} found at current level.`);
//     return grpcObject[serviceName];
//   }

//   for (const key in grpcObject) {
//     if (typeof grpcObject[key] === 'object') {
//       console.log(`Descending into ${key}...`);
//       const nestedService = findService(grpcObject[key], serviceName);
//       if (nestedService) {
//         console.log(`Service ${serviceName} found in ${key}.`);
//         return nestedService;
//       }
//     }
//   }

//   console.log(`Service ${serviceName} not found.`);
//   return null;
// }

program
  .option('-c, --config <path>', 'Path to the YAML configuration file')
  .option(
    '-d, --duration <type>',
    'set the duration of the load test in seconds',
    '10'
  )
  .option('-p, --proto <path>', 'path to the .proto file')
  .option('-s, --service <name>', 'name of the gRPC service')
  .option('-m, --method <name>', 'name of the method to test')
  .option(
    '--payload <path>',
    'path to a JavaScript file that exports the payload'
  )
  .option(
    '--callback <path>',
    'path to a JavaScript file that exports the callback function'
  )
  .parse(process.argv);

const options = program.opts();

export let config: LoadTestConfig = {
  duration: 10,
  packageName: '',
  protoPath: '',
  serviceName: '',
  methodName: '',
  payloadPath: '',
  callbackPath: '',
  host: '',
}; // Initialize with default values

interface IYamlConfig extends LoadTestConfig {
  protoPath?: string;
  serviceName?: string;
  packageName?: string;
  methodName?: string;
  payloadPath?: string;
  callbackPath?: string;
  host?: string;
}
// If a YAML config file is provided, use it to override command-line options
if (options.config) {
  if (typeof options.config === 'string') {
    const configPath = path.resolve(process.cwd(), options.config);
    const yamlConfig: IYamlConfig = yaml.load(
      fs.readFileSync(configPath, 'utf8')
    ) as IYamlConfig;
    config = yamlConfig;
  } else {
    console.log('Please provide a valid path to the YAML configuration file');
    process.exit(1);
  }
} else {
  config = {
    duration: parseInt(options.duration ?? '10', 10),
    protoPath: options.proto ?? '',
    serviceName: options.service ?? '',
    methodName: options.method ?? '',
    payloadPath: options.payload ?? '',
    callbackPath: options.callback ?? '',
    host: options.host ?? '',
  };
}
// Load the gRPC Object
// const packageDef = protoLoader.loadSync(
//   path.resolve(__dirname, config.protoPath ?? '')
// );
// const grpcObj = grpc.loadPackageDefinition(packageDef);

// // Create the gRPC client stub
// const pkg = grpcObj[config.packageName ?? ''];

// // Check if the service exists
// if (!pkg) {
//   console.error(
//     `Service "${config.serviceName}" not found in the loaded .proto file.`
//   );
//   process.exit(1); // Exit with an error code
// }
// const methodName = config.methodName;

// export const service = pkg[config.serviceName ?? ''];

// export const client = new service(
//   `localhost:50052`,
//   grpc.credentials.createInsecure()
// );

// const clientInterceptor = new MetricInterceptor();
// const callOptions = { interceptors: [clientInterceptor.interceptor] };

// Dynamically import payload and callback
// const payload = require(path.resolve(__dirname, config.payloadPath ?? ''));
// const callback = require(path.resolve(__dirname, config.callbackPath ?? ''));

// setTimeout(async () => {
//   generateHTML(clientInterceptor.latencyData);
// }, 4000);

// Initialize LoadTestEngine and add the call
// WHAT??
// const engine = new LoadTestEngine(config);

// engine.addCall(
//   client[methodName ?? ''].bind(client),
//   payload,
//   otherOptions,
//   callback,
//   0
// );

// // Start and stop load testing based on the duration
// engine.run();

// setTimeout(async () => {
//   generateHTML(clientInterceptor.latencyData);
//   engine.stopAll();
// }, config.duration * 1000);
loadT().catch((err) => {
  console.error('An error occured: ', err);
  process.exit(1);
});
