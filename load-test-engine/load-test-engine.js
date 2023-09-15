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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTestEngineInstance = exports.LoadTestEngine = void 0;
var hash = require('crypto');
var loadTester_1 = __importDefault(require("../server/loadTester"));
var grpc = __importStar(require("@grpc/grpc-js"));
var path = __importStar(require("path"));
var protoLoader = __importStar(require("@grpc/proto-loader"));
var clientInterceptor = new loadTester_1.default();
var options = { interceptors: [clientInterceptor.interceptor] };
// Generates a label if one is not provided by user
function hashCall(stub, message, interval) {
    return hash.createHash('sha256')
        .update(stub.toString() + JSON.stringify(message) + interval.toString())
        .digest('hex');
}
// function findService(grpcObject: any, serviceName: string): any {
//   console.log(`Searching for service ${serviceName}...`);
//   if (grpcObject[serviceName]) {
//     // console.log(`Service ${serviceName} found at current level.`);
//     return grpcObject[serviceName];
//   }
//   for (const key in grpcObject) {
//     if (typeof grpcObject[key] === 'object') {
//       console.log(`Descending into ${key}...`);
//       const nestedService = findService(grpcObject[key], serviceName);
//       if (nestedService) {
//         // console.log(`Service ${serviceName} found in ${key}.`);
//         return nestedService;
//       }
//     }
//   }
//   console.log(`Service ${serviceName} not found.`);
//   return null;
// }
// Recursive setTimeout for repeating calls
function repeatCall(call) {
    // Type issue with grpc.CallOptions, temporarily disabling call count limit
    if (call.options.interceptors !== undefined && call.count >= options.interceptors.length) {
        console.log('Clearing timeout');
        clearTimeout(call.timeout);
        return;
    }
    // console.log("call.timeout: ", call.timeout)
    if (typeof call.stub === 'function') {
        var instance = new call.stub.constructor();
        console.log("instance: ", instance);
        // instance[instance.originalName](call.message, call.options, call.callback);
        instance(call.message, call.options, call.callback);
    }
    call.stub(call.message, call.options, call.callback);
    call.timeout = setTimeout(function () { repeatCall(call); }, call.interval);
    console.log("Prototype of call.stub:", Object.getPrototypeOf(call.stub));
}
var LoadTestEngine = /** @class */ (function () {
    function LoadTestEngine(config) {
        this.config = config;
        this.calls = {};
        this.active = {};
        if (config.protoPath && config.serviceName && config.methodName) {
            this.setupGrpcClient();
        }
    }
    LoadTestEngine.prototype.setupGrpcClient = function () {
        var packageDef = protoLoader.loadSync(path.resolve(__dirname, this.config.protoPath));
        var grpcObj = grpc.loadPackageDefinition(packageDef);
        // console.log("grpcObject: ", grpcObj);
        var Pkg = grpcObj[this.config.packageName];
        // const Pkg = findService(grpcObj, this.config.packageName);
        if (!Pkg) {
            throw new Error("Service \"".concat(this.config.serviceName, "\" not found in the loaded .proto file."));
        }
        // console.log(typeof Pkg);
        // console.log("Package: ______", Pkg);
        // const client =  (new Pkg[this.config.methodName](this.config.protoPath, grpc.credentials.createInsecure())); 
        var client = new Pkg[this.config.serviceName]('localhost:8082', grpc.credentials.createInsecure()); // Replace with your server details
        // console.log("CLIENT: ", client)
        // Assuming unary call for simplicity; you may need to handle different types of calls
        // console.log('pkg: ',Pkg)
        // const stub: Stub = (message, options, callback) => {
        //    const stubs = (client as any)[this.config.methodName] as Function
        //   // return stubs(message, options, callback)
        //   this.addCall(stubs.bind(client), payload, options, callback, interval);
        //   return  stubs
        //  };
        // Load custom payload and callback if provided
        var payload = this.config.payloadPath ? require(this.config.payloadPath) : {};
        var callback = this.config.callbackPath ? require(this.config.callbackPath) : function (err, res) { };
        var options = {};
        var interval = 1000;
    };
    LoadTestEngine.prototype.addCall = function (stub, message, options, callback, interval, count, label, timeout) {
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
            stub: stub,
            message: message,
            options: options,
            callback: callback,
            interval: interval,
            count: count,
            timeout: timeout,
        };
        console.log("Call ".concat(label, " added."));
        return this;
    };
    LoadTestEngine.prototype.removeCall = function (label) {
        if (this.calls[label]) {
            delete this.calls[label];
            console.log("Call ".concat(label, " removed"));
            return this;
        }
        else {
            throw new Error('Label does not exist.');
        }
    };
    LoadTestEngine.prototype.getLabels = function () {
        return Object.keys(this.calls);
    };
    LoadTestEngine.prototype.start = function (labels) {
        var _this = this;
        labels.forEach(function (label) {
            // Check that call is not already active
            if (!_this.active[label]) {
                // The associated this.calls object for the current label
                var call = _this.calls[label];
                // Set a recursive timeout
                console.log("Call ".concat(label, " started."));
                repeatCall(call);
                // Add to active calls tracker
                _this.active[label] = call;
            }
        });
    };
    LoadTestEngine.prototype.startAll = function () {
        console.log("Starting all calls.");
        for (var label in this.calls) {
            if (!this.active[label]) {
                var call = this.calls[label];
                console.log("Call ".concat(label, " started."));
                repeatCall(call);
                this.active[label] = call;
            }
        }
    };
    LoadTestEngine.prototype.stop = function (labels) {
        var _this = this;
        labels.forEach(function (label) {
            clearTimeout(_this.active[label].timeout);
            delete _this.active[label];
            console.log("Call ".concat(label, " stopped."));
        });
    };
    LoadTestEngine.prototype.stopAll = function () {
        if (!Object.keys(this.active).length) {
            throw new Error('No active calls.');
        }
        for (var label in this.active) {
            clearTimeout(this.active[label].timeout);
            delete this.active[label];
            console.log("Call ".concat(label, " stopped."));
        }
        console.log('All active calls stopped.');
    };
    LoadTestEngine.prototype.run = function () {
        var _this = this;
        this.startAll();
        setTimeout(function () {
            _this.stopAll();
            // Generate HTML or other reports here
        }, this.config.duration * 1000);
    };
    return LoadTestEngine;
}());
exports.LoadTestEngine = LoadTestEngine;
// module.exports = new LoadTestEngine();
exports.loadTestEngineInstance = new LoadTestEngine({ duration: 10000 }); // example duration
