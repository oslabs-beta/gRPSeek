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
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var grpc = __importStar(require("@grpc/grpc-js"));
var protoLoader = __importStar(require("@grpc/proto-loader"));
var grpc_server_reflection_1 = require("grpc-server-reflection");
var logging_1 = require("@grpc/grpc-js/build/src/logging");
var PORT = 8082;
var PROTO_FILE = '../proto/helloworld.proto';
var packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE));
var grpcObj = grpc.loadPackageDefinition(packageDef);
var greeterPackage = grpcObj.greeterPackage;
var DESCRIPTOR_PATH = path.resolve(__dirname, '../proto/descriptor_set.bin');
logging_1.log;
function main() {
    var server = getServer();
    (0, grpc_server_reflection_1.addReflection)(server, DESCRIPTOR_PATH);
    var serverCredentials = grpc.ServerCredentials.createInsecure();
    server.bindAsync("0.0.0.0:".concat(PORT), serverCredentials, function (err, port) {
        if (err) {
            console.log("Error: ", err);
            return;
        }
        console.log("Your server has started on port ".concat(port));
        server.start();
    });
}
function getServer() {
    var server = new grpc.Server();
    server.addService(greeterPackage.Greeter.service, {
        SayHello: function (call, callback) {
            console.log("Server received request: ", call.request);
            if (typeof call.request === 'string') {
                callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid arg from server (SayHello)" });
            }
            else {
                callback(null, { message: "Hello from server" });
            }
        },
        SayHelloAgain: function (call, callback) {
            // console.log("Server received request: ", req.request);
            var value = Math.floor(Math.random() * 10);
            if (value < 2) {
                callback({ code: grpc.status.INVALID_ARGUMENT, message: "Invalid arg from server (SayHelloAgain)" });
            }
            else {
                callback(null, { message: "Hello again from server" });
            }
        }
    });
    return server;
}
main();
