"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grpc = require("@grpc/grpc-js");
var perf_hooks_1 = require("perf_hooks");
var fs = require("fs");
var path = require("path");
var MetricInterceptor = /** @class */ (function () {
    function MetricInterceptor() {
        var _this = this;
        this.interceptor = function (options, nextCall) {
            var startTime;
            var endTime;
            //create a requestor intercepts outbound operations (start, sendMessage)
            var requestor = {
                //start method called before an outbound call has started. This is where to define listener and methods that occur with inbound operations
                start: function (metadata, listener, next) {
                    //listener that intercepts inbound operations - receiving server status and message
                    var newListener = {
                        onReceiveMessage: function (message, next) {
                            console.log('inbound message received: ', message);
                            var endTime = perf_hooks_1.performance.now();
                            var timeDuration = endTime - startTime;
                            //duration in ms
                            fs.writeFileSync(path.join(__dirname, '../metrics/time.txt'), "Time Duration: ".concat(timeDuration, ", Call ").concat(_this.numCalls, "\n"), { flag: "a+" });
                        },
                        onReceiveStatus: function (status, next) {
                            if (status.code !== grpc.status.OK) {
                                _this.numErrors++;
                                console.log("status error: ".concat(grpc.status[status.code], " message: ").concat(status.details, ", ").concat(_this.numErrors, ", ").concat(_this.numCalls));
                                //   Potential Stretch feature: handling failed requests with a fallback method
                            }
                            next(status);
                        }
                    };
                    next(metadata, newListener);
                },
                //sendMesssage method called before every outbound message - where we count total number of calls, time start
                sendMessage: function (message, next) {
                    // console.log('outbound message sent: ', message);
                    startTime = perf_hooks_1.performance.now();
                    _this.numCalls++;
                    console.log(_this.numCalls);
                    next(message);
                }
            };
            var call = new grpc.InterceptingCall(nextCall(options), requestor);
            return call;
        };
        this.getNumCalls = function () { return _this.numCalls; };
        this.getNumErrors = function () { return _this.numErrors; };
        this.resetMetrics = function () { _this.numCalls = 0; _this.numErrors = 0; };
        this.numCalls = 0;
        this.numErrors = 0;
    }
    return MetricInterceptor;
}());
exports.default = MetricInterceptor;
