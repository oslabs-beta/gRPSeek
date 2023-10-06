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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.service = void 0;
// process.env.GRPC_NODE_TRACE = 'api,channel';
// process.env.GRPC_NODE_VERBOSITY = 'DEBUG';
var commander_1 = require("commander");
var fs_1 = __importDefault(require("fs"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var path_1 = __importDefault(require("path"));
var grpc = __importStar(require("@grpc/grpc-js"));
var protoLoader = __importStar(require("@grpc/proto-loader"));
var load_test_engine_1 = require("../load-test-engine/load-test-engine");
var loadTester_1 = __importDefault(require("../server/loadTester"));
var generateHTML_1 = require("../utils/generateHTML");
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
    .option('-h, --host <host>', 'host to connect to', 'localhost')
    .parse(process.argv);
var options = commander_1.program.opts();
var config = {
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
        var yamlConfig = js_yaml_1.default.load(fs_1.default.readFileSync(configPath, 'utf8'));
        config = yamlConfig;
    }
    else {
        console.log('Please provide a valid path to the YAML configuration file');
        process.exit(1);
    }
}
else {
    config = {
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
var packageDef = protoLoader.loadSync(path_1.default.resolve(__dirname, (_h = config.protoPath) !== null && _h !== void 0 ? _h : ''));
var grpcObj = grpc.loadPackageDefinition(packageDef);
// Create the gRPC client stub
var pkg = grpcObj[(_j = config.packageName) !== null && _j !== void 0 ? _j : ''];
// Check if the service exists
if (!pkg) {
    console.error("Service \"".concat(config.serviceName, "\" not found in the loaded .proto file."));
    process.exit(1); // Exit with an error code
}
var methodName = config.methodName;
exports.service = pkg[(_k = config.serviceName) !== null && _k !== void 0 ? _k : ''];
exports.client = new exports.service("localhost:".concat(config.host), grpc.credentials.createInsecure());
// const clientInterceptor = new MetricInterceptor();
// const callOptions = { interceptors: [clientInterceptor.interceptor] };
// Dynamically import payload and callback
var payload = require(path_1.default.resolve(__dirname, (_l = config.payloadPath) !== null && _l !== void 0 ? _l : ''));
var callback = require(path_1.default.resolve(__dirname, (_m = config.callbackPath) !== null && _m !== void 0 ? _m : ''));
// Initialize LoadTestEngine and add the call
var engine = new load_test_engine_1.LoadTestEngine(config);
engine.addCall(exports.client[methodName !== null && methodName !== void 0 ? methodName : ''].bind(exports.client), payload, otherOptions, callback, 0);
// // Start and stop load testing based on the duration
engine.run();
setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        (0, generateHTML_1.generateHTML)(clientInterceptor.latencyData);
        engine.stopAll();
        return [2 /*return*/];
    });
}); }, config.duration * 1000);
