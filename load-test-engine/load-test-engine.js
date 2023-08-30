// Only used for hashCall()
var hash = require('crypto');
// Generates a label if one is not provided by user
function hashCall(stub, message, interval) {
    return hash.createHash('sha256')
        .update(stub.toString() + JSON.stringify(message) + interval.toString())
        .digest('hex');
}
// Recursively calls setTimeout for repeating calls
function repeatCall(call) {
    call.stub(call.message);
    call.timeout = setTimeout(function () { repeatCall(call); }, call.interval);
}
// Load test engine to be instantiated
var LoadTestEngine = /** @class */ (function () {
    function LoadTestEngine() {
        this.calls = {};
        this.active = {};
    }
    LoadTestEngine.prototype.addCall = function (stub, message, interval, label, timeout) {
        if (label === void 0) { label = hashCall(stub, message, interval); }
        if (this.calls[label]) {
            throw new Error('Label already exists.');
        }
        this.calls[label] = {
            stub: stub,
            message: message,
            interval: interval,
            timeout: timeout
        };
        console.log("Call ".concat(label, " added."));
        return this;
    };
    LoadTestEngine.prototype.removeCall = function (label) {
        if (this.calls[label]) {
            delete this.calls[label];
            console.log("Call ".concat(label, " removed"));
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
                repeatCall(call);
                console.log("Call ".concat(label, " started."));
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
                repeatCall(call);
                console.log("Call ".concat(label, " started."));
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

module.exports = new LoadTestEngine;
