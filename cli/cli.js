#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// process.env.GRPC_NODE_TRACE = 'api,channel';
// process.env.GRPC_NODE_VERBOSITY = 'DEBUG';
var commander_1 = require("commander");
var fs = __importStar(require("fs"));
var yaml = __importStar(require("js-yaml"));
var path_1 = __importDefault(require("path"));
var loadTester_1 = __importDefault(require("../server/loadTester"));
// import { generateHTML } from '../utils/generateHTML';
var cluster_1 = __importDefault(require("../server/cluster"));
var clientInterceptor = new loadTester_1.default();
var otherOptions = { interceptors: [clientInterceptor.interceptor] };
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
commander_1.program
    .option('-c, --config <path>', 'Path to the YAML configuration file')
    .option('-d, --duration <type>', 'set the duration of the load test in seconds', '10')
    .option('-p, --proto <path>', 'path to the .proto file')
    .option('-s, --service <name>', 'name of the gRPC service')
    .option('-m, --method <name>', 'name of the method to test')
    .option('--payload <path>', 'path to a JavaScript file that exports the payload')
    .option('--callback <path>', 'path to a JavaScript file that exports the callback function')
    .parse(process.argv);
var options = commander_1.program.opts();
exports.config = {
    duration: 10,
    packageName: '',
    protoPath: '',
    serviceName: '',
    methodName: '',
    payloadPath: '',
    callbackPath: '',
    host: '',
}; // Initialize with default values
// If a YAML config file is provided, use it to override command-line options
if (options.config) {
    if (typeof options.config === 'string') {
        var configPath = path_1.default.resolve(process.cwd(), options.config);
        var yamlConfig = yaml.load(fs.readFileSync(configPath, 'utf8'));
        exports.config = yamlConfig;
    }
    else {
        console.log('Please provide a valid path to the YAML configuration file');
        process.exit(1);
    }
}
else {
    exports.config = {
        duration: parseInt((_a = options.duration) !== null && _a !== void 0 ? _a : '10', 10),
        protoPath: (_b = options.proto) !== null && _b !== void 0 ? _b : '',
        serviceName: (_c = options.service) !== null && _c !== void 0 ? _c : '',
        methodName: (_d = options.method) !== null && _d !== void 0 ? _d : '',
        payloadPath: (_e = options.payload) !== null && _e !== void 0 ? _e : '',
        callbackPath: (_f = options.callback) !== null && _f !== void 0 ? _f : '',
        host: (_g = options.host) !== null && _g !== void 0 ? _g : '',
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
(0, cluster_1.default)().catch(function (err) {
    console.error('An error occured: ', err);
    process.exit(1);
});
