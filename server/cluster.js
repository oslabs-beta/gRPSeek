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
Object.defineProperty(exports, "__esModule", { value: true });
var cluster = require('cluster');
var os = require('os');
var node_os_1 = require("node:os");
var node_process_1 = require("node:process");
var node_worker_threads_1 = require("node:worker_threads");
var readline = __importStar(require("node:readline/promises"));
var path = __importStar(require("path"));
var grpc = __importStar(require("@grpc/grpc-js"));
var protoLoader = __importStar(require("@grpc/proto-loader"));
var loadTester_1 = __importDefault(require("./loadTester"));
var genDash_1 = require("../genDash");
/**
 * Data Storage Metrics
 */
var cpuUsageData = [];
var eluData = [];
var totalWorkers = 0;
var exitedWorkers = 0;
var readLine = readline.createInterface({ input: node_process_1.stdin, output: node_process_1.stdout });
var numCPUs = (0, node_os_1.availableParallelism)();
function inputQuery(label, question, errorMsg) {
    if (errorMsg === void 0) { errorMsg = "Input was not a number"; }
    return __awaiter(this, void 0, void 0, function () {
        var numInput, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = parseInt;
                    return [4 /*yield*/, readLine.question("".concat(question, "\n"))];
                case 1:
                    numInput = _a.apply(void 0, [_c.sent()]);
                    _c.label = 2;
                case 2:
                    if (!isNaN(numInput)) return [3 /*break*/, 4];
                    console.log("\u001B[91m \nERROR: ".concat(errorMsg, ". Please try again.\u001B[0m"));
                    _b = parseInt;
                    return [4 /*yield*/, readLine.question("".concat(question, "\n"))];
                case 3:
                    numInput = _b.apply(void 0, [_c.sent()]);
                    return [3 /*break*/, 2];
                case 4:
                    console.log("\n".concat(label, " Input: ").concat(numInput));
                    return [2 /*return*/, numInput];
            }
        });
    });
}
/** CURRENT HYPOTHESIS: MAIN FUNCTION IS REPEATED FOR ALL WORKER THREADS. WOULD HAVE TO TAKE THE INPUT CODE OUT AND MOVE IT. ALSO HAVE TO UTILIZE MAIN PROCESS/THREAD SO TOTAL NUMBER OF CALLS ACROSS ALL THREADS EQUATE TO NUMBER OF CALLS THE CLIENT WANTS
 *
 * IF cntrl c does not work, open console and type 'ps'
 * find the pid of the node cluster.js process
 * in console type 'kill -9 <pid>'
 */
function gatherInputs() {
    return __awaiter(this, void 0, void 0, function () {
        var numClusters, maxNumberofWorkersPerCluster, numWorkers, numCalls;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inputQuery("NumClusters", "How many clusters? Recommended Number (Max Number of CPUs): ".concat(numCPUs))];
                case 1:
                    numClusters = _a.sent();
                    maxNumberofWorkersPerCluster = Math.floor(numCPUs / numClusters);
                    return [4 /*yield*/, inputQuery("NumWorkers", "How many worker threads per cluster? Recommended Number: ".concat(maxNumberofWorkersPerCluster))];
                case 2:
                    numWorkers = _a.sent();
                    return [4 /*yield*/, inputQuery("NumCalls", "How many calls per thread to the server?")];
                case 3:
                    numCalls = _a.sent();
                    return [2 /*return*/, { numClusters: numClusters, numWorkers: numWorkers, numCalls: numCalls }];
            }
        });
    });
}
function loadT() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, numClusters, numWorkers, numCalls, i, numWorkers, numCalls, lastMeasure_1, activeWorkers_1, _loop_1, i, numCalls_1, counter_1, PORT, PROTO, packageDef, grpcObj, greeterPackage, client_1, clientInterceptor_1, runStub_1, copy_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(cluster.isPrimary && node_worker_threads_1.isMainThread)) return [3 /*break*/, 2];
                    console.log("This is the gRPSeek Load Balance Tester! The tester requires you to input the number of concurrent processes you'd like to run to simulate a grpc server load.");
                    return [4 /*yield*/, gatherInputs()];
                case 1:
                    _a = _b.sent(), numClusters = _a.numClusters, numWorkers = _a.numWorkers, numCalls = _a.numCalls;
                    //Main process - set up cluster workers
                    console.log("Primary ".concat(process.pid, " is running"));
                    for (i = 0; i < numClusters; i++) {
                        cluster.fork({ numWorkers: numWorkers, numCalls: numCalls });
                    }
                    cluster.on('online', function (worker) {
                        console.log("worker ".concat(worker.process.pid, " is forked and running"));
                    });
                    // Initialize total number of worker processes assuming each cluster forks one worker
                    totalWorkers = numClusters;
                    cluster.on('exit', function (worker, code, signal) {
                        console.log("worker ".concat(worker.process.pid, " died"));
                        exitedWorkers++;
                        if (exitedWorkers >= totalWorkers) {
                            var fs = require('fs');
                            try {
                                var dashboardHtml = (0, genDash_1.generateGrpcLoadTestDashboard)(cpuUsageData, eluData);
                                fs.writeFileSync('./dash.html', dashboardHtml);
                                console.log('Dashboard HTML written successfully');
                            }
                            catch (error) {
                                console.error('Error writing HTML dashboard:', error);
                            }
                            // All workers have exited, close readLine and exit
                            readLine.close();
                            process.exit(0);
                        }
                    });
                    cluster.on('message', function (worker, message, handle) {
                        if (message.type === 'CPU') {
                            cpuUsageData.push({
                                workerId: message.workerId,
                                clusterId: message.clusterId,
                                value: message.data,
                            });
                        }
                        else if (message.type === 'ELU') {
                            eluData.push({
                                workerId: message.workerId,
                                clusterId: message.clusterId,
                                value: message.data,
                            });
                        }
                    });
                    return [3 /*break*/, 3];
                case 2:
                    numWorkers = process.env.numWorkers
                        ? parseInt(process.env.numWorkers)
                        : 1;
                    numCalls = process.env.numCalls ? parseInt(process.env.numCalls) : 1;
                    //Worker Cluster process
                    if (node_worker_threads_1.isMainThread) {
                        lastMeasure_1 = os.cpus();
                        activeWorkers_1 = 0;
                        _loop_1 = function (i) {
                            activeWorkers_1++;
                            var worker = new node_worker_threads_1.Worker(__filename, { workerData: { numCalls: numCalls } });
                            setInterval(function () {
                                var currentMeasure = os.cpus();
                                var _loop_2 = function (i_1) {
                                    var idleDifference = currentMeasure[i_1].times.idle - lastMeasure_1[i_1].times.idle;
                                    var totalDifference = Object.keys(currentMeasure[i_1].times).reduce(function (total, mode) {
                                        return (total +
                                            currentMeasure[i_1].times[mode] -
                                            lastMeasure_1[i_1].times[mode]);
                                    }, 0);
                                    var cpuUsage = (1 - idleDifference / totalDifference) * 100;
                                    process.send({
                                        type: 'CPU',
                                        data: cpuUsage,
                                        workerId: worker.threadId,
                                        clusterId: process.pid,
                                    });
                                    process.send({
                                        type: 'ELU',
                                        data: worker.performance.eventLoopUtilization(),
                                        workerId: worker.threadId,
                                        clusterId: process.pid,
                                    });
                                    console.log('CPU Usage: ', cpuUsage);
                                    console.log('ELU: ', worker.performance.eventLoopUtilization());
                                };
                                for (var i_1 = 0; i_1 < currentMeasure.length; i_1++) {
                                    _loop_2(i_1);
                                }
                                // Check the worker's usage directly and immediately. The call is thread-safe
                                // so it doesn't need to wait for the worker's event loop to become free.
                            }, 100);
                            //listen for messages from the worker and errors
                            worker.on('message', function (msg) {
                                console.log(msg);
                            });
                            worker.on('exit', function (code) {
                                if (code !== 0)
                                    new Error("Worker stopped with exit code ".concat(code));
                                activeWorkers_1--;
                                if (activeWorkers_1 === 0) {
                                    process.exit(0);
                                }
                            });
                        };
                        for (i = 0; i < numWorkers; i++) {
                            _loop_1(i);
                        }
                    }
                    else {
                        numCalls_1 = node_worker_threads_1.workerData.numCalls;
                        counter_1 = 0;
                        PORT = 50051;
                        PROTO = '../proto/helloworld.proto';
                        packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO));
                        grpcObj = grpc.loadPackageDefinition(packageDef);
                        greeterPackage = grpcObj.greeterPackage;
                        client_1 = new grpcObj.greeterPackage.Greeter("0.0.0.0:".concat(PORT), grpc.credentials.createInsecure());
                        clientInterceptor_1 = new loadTester_1.default();
                        runStub_1 = function () {
                            client_1.sayHello({ name: 'Kenny' }, { interceptors: [clientInterceptor_1.interceptor] }, function (err, res) {
                                if (err) {
                                    console.log('error', err);
                                    return;
                                }
                                console.log('result:', res);
                            });
                        };
                        copy_1 = function () {
                            counter_1++;
                            if (counter_1 < numCalls_1) {
                                setTimeout(function () {
                                    copy_1();
                                }, 1);
                            }
                            runStub_1();
                        };
                        copy_1();
                        setTimeout(function () {
                            console.log('Finished calls: ', clientInterceptor_1.numCalls);
                            console.log('Number of failed requests: ', clientInterceptor_1.numErrors);
                            // clientInterceptor.generateHTMLReport();
                        }, 1000);
                    }
                    //close the prompt
                    readLine.close();
                    _b.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.default = loadT;
loadT().catch(function (err) {
    console.error('An error occured: ', err);
    process.exit(1);
});
