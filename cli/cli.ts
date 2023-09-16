import { program } from 'commander';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import {
  LoadTestEngine,
  LoadTestConfig,
} from '../load-test-engine/load-test-engine';

function findService(
  grpcObject: Record<string, any>,
  serviceName: string
): Record<string, any> | null {
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

let config: LoadTestConfig = {
  duration: 10,
  packageName: '',
  protoPath: '',
  serviceName: '',
  methodName: '',
  payloadPath: '',
  callbackPath: '',
}; // Initialize with default values

interface IYamlConfig extends LoadTestConfig {
  protoPath?: string;
  serviceName?: string;
  packageName?: string;
  methodName?: string;
  payloadPath?: string;
  callbackPath?: string;
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
  };
}

// Load the gRPC Object
const packageDef = protoLoader.loadSync(
  path.resolve(__dirname, config.protoPath ?? '')
);
const grpcObj = grpc.loadPackageDefinition(packageDef);

// Create the gRPC client stub
const pkg = grpcObj[config.packageName ?? ''];

// Check if the service exists
if (!pkg) {
  console.error(
    `Service "${config.serviceName}" not found in the loaded .proto file.`
  );
  process.exit(1); // Exit with an error code
}
const methodName = config.methodName;

const service = pkg[config.serviceName ?? ''];

const client = new service(`localhost:8082`, grpc.credentials.createInsecure());

// Dynamically import payload and callback
const payload = require(path.resolve(__dirname, config.payloadPath ?? ''));
const callback = require(path.resolve(__dirname, config.callbackPath ?? ''));

// Initialize LoadTestEngine and add the call

const engine = new LoadTestEngine(config);

engine.addCall(
  client[methodName ?? ''].bind(client),
  payload,
  {},
  callback,
  1000
);

// Start and stop load testing based on the duration
engine.run();
setTimeout(() => {
  engine.stopAll();
}, config.duration * 1000);
