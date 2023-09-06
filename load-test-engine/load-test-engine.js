"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hash = require('crypto');
// Generates a label if one is not provided by user
function hashCall(stub, message, interval) {
    return hash.createHash('sha256')
        .update(stub.toString() + JSON.stringify(message) + interval.toString())
        .digest('hex');
}
// Recursive setTimeout for repeating calls
function repeatCall(call) {
    // Type issue with grpc.CallOptions, temporarily disabling call count limit
    // if (call.options.interceptors !== undefined && call.count >= call.options.interceptors[0].numCalls) {
    //   clearTimeout(call.timeout);
    //   return;
    // }
    call.stub(call.message, call.options, call.callback);
    call.timeout = setTimeout(function () { repeatCall(call); }, call.interval);
}
var LoadTestEngine = /** @class */ (function () {
    function LoadTestEngine() {
        this.calls = {};
        this.active = {};
    }
    LoadTestEngine.prototype.addCall = function (stub, message, options, callback, interval, count, label, timeout) {
        if (count === void 0) { count = Infinity; }
        if (label === void 0) { label = hashCall(stub, message, interval); }
        if (this.calls[label]) {
            throw new Error('Label already exists.');
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
    return LoadTestEngine;
}());
module.exports = new LoadTestEngine();
