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
var path = __importStar(require("path"));
var grpc = __importStar(require("@grpc/grpc-js"));
var protoLoader = __importStar(require("@grpc/proto-loader"));
var loadTester_1 = __importDefault(require("../server/loadTester"));
var LTE = require('../load-test-engine/load-test-engine');
var PORT = 8082;
var PROTO = '../proto/helloworld.proto';
process.env.GRPC_TRACE = 'api,channel';
process.env.GRPC_VERBOSITY = 'DEBUG';
var packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO), {});
var grpcObj = grpc.loadPackageDefinition(packageDef);
var greeterPackage = grpcObj.greeterPackage;
var client = new greeterPackage.Greeter("0.0.0.0:".concat(PORT), grpc.credentials.createInsecure());
console.log("CLIENT: ", client);
var clientInterceptor = new loadTester_1.default();
// Arguments to be passed into each RPC
var message = { name: "Kenny" };
var options = { interceptors: [clientInterceptor.interceptor] };
var callback = function (err, res) {
    if (err) {
        console.log('error', err);
        return;
    }
    console.log("result:", res);
};
// let obj = client;
// while (obj) {
//   console.log(Object.getOwnPropertyNames(obj));
//   obj = Object.getPrototypeOf(obj);
// }
// Iterate through client and add RPCs to engine, ignoring duplicate (Pascal case) versions of the RPCs.
for (var key in client) {
    if (key[0] >= "a" && key[0] <= "z") {
        var stub = client[key];
        LTE.addCall(stub.bind(client), message, options, callback, 1000, undefined, "TestCall:" + key);
    }
}
// Start load testing
LTE.startAll();
// Stop load testing after 10 seconds
setTimeout(function () { LTE.stopAll(); }, 10000);
