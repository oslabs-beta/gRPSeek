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
var grpc = __importStar(require("@grpc/grpc-js"));
var perf_hooks_1 = require("perf_hooks");
var generateHTML_1 = require("../utils/generateHTML");
var MetricInterceptor = /** @class */ (function () {
    function MetricInterceptor() {
        var _this = this;
        this.interceptor = function (options, nextCall) {
            var startTime;
            var endTime;
            // Create a requestor intercepts outbound operations (start, sendMessage)
            var requestor = {
                // Start method called before an outbound call has started. This is where to define listener and methods that occur with inbound operations
                start: function (metadata, listener, next) {
                    // Listener that intercepts inbound operations - receiving server status and message
                    var newListener = {
                        onReceiveMessage: function (message, next) {
                            console.log('inbound message received: ', message);
                            var endTime = perf_hooks_1.performance.now();
                            var timeDuration = endTime - startTime;
                            _this.latencyData.push({
                                requestNumber: _this.numCalls,
                                latency: timeDuration,
                            });
                            next(message);
                        },
                        onReceiveStatus: function (status, next) {
                            if (status.code !== grpc.status.OK) {
                                _this.numErrors++;
                                console.log("status error: ".concat(grpc.status[status.code], " message: ").concat(status.details, ", ").concat(_this.numErrors, ", ").concat(_this.numCalls));
                            }
                            next(status);
                        },
                    };
                    next(metadata, newListener);
                },
                //sendMesssage method called before every outbound message - where we count total number of calls, time start
                sendMessage: function (message, next) {
                    console.log('outbound message sent: ', message);
                    startTime = perf_hooks_1.performance.now();
                    _this.numCalls++;
                    console.log(_this.numCalls);
                    next(message);
                },
            };
            var call = new grpc.InterceptingCall(nextCall(options), requestor);
            return call;
        };
        this.getNumCalls = function () { return _this.numCalls; };
        this.getNumErrors = function () { return _this.numErrors; };
        this.resetMetrics = function () {
            _this.numCalls = 0;
            _this.numErrors = 0;
        };
        this.numCalls = 0;
        this.numErrors = 0;
        this.latencyData = [];
    }
    MetricInterceptor.prototype.generateHTMLReport = function () {
        (0, generateHTML_1.generateHTML)(this.latencyData);
    };
    return MetricInterceptor;
}());
exports.default = MetricInterceptor;
