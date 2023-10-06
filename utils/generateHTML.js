"use strict";
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
exports.generateHTML = void 0;
var promises_1 = __importDefault(require("fs/promises"));
var path_1 = __importDefault(require("path"));
var filePath = path_1.default.join(__dirname, './dashboard.html');
function generateHTML(latencyData) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1, requestNumbers, latencies, htmlContent, createErr_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.access(filePath, promises_1.default.constants.W_OK)];
                case 1:
                    _a.sent();
                    console.log('Write access exists');
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log('No write access, but will try to create or update the file.');
                    return [3 /*break*/, 3];
                case 3:
                    requestNumbers = latencyData.map(function (item) { return item.requestNumber; });
                    latencies = latencyData.map(function (item) { return item.latency; });
                    if (requestNumbers.length === 0 || latencies.length === 0) {
                        console.log('No data to generate HTML file');
                        return [2 /*return*/];
                    }
                    htmlContent = " <!DOCTYPE html>\n  <html>\n  <head>\n    <title>Time-Series Dashboard</title>\n    <script src=\"https://cdn.plot.ly/plotly-latest.min.js\"></script>\n  </head>\n  <body>\n    <div class=\"dashboard\">\n      <div class=\"dashboard-header\">\n        <h1 class=\"dashboard-title\">Time-Series Dashboard</h1>\n      </div>\n      <div class=\"plot-container\">\n        <div id=\"latency-over-time\"></div>\n        <div id=\"latency-distribution\"></div>\n        <div id=\"latency-summary\"></div>\n        <div id=\"latency-scatter-plot\"></div>\n      </div>\n    </div>\n    <script>\n      const requestNumbers = ".concat(JSON.stringify(requestNumbers), ";\n      const latencies = ").concat(JSON.stringify(latencies), ";\n\n      Plotly.newPlot('latency-over-time', [{\n        x: requestNumbers,\n        y: latencies,\n        type: 'scatter',\n        mode: 'lines+markers',\n        marker: { color: 'blue', size: 8 },\n        line: { color: 'blue', width: 2, shape: 'spline' },\n      }], {\n        title: 'Latency Over Time',\n        xaxis: { title: 'Request Number', showgrid: false, zeroline: false },\n        yaxis: { title: 'Latency', showline: false },\n        hovermode: 'closest',\n        plot_bgcolor: '#f3f3f3',\n      });\n\n      Plotly.newPlot('latency-distribution', [{\n        x: latencies,\n        type: 'histogram',\n        marker: { color: 'green' },\n      }], {\n        title: 'Latency Distribution',\n        xaxis: { title: 'Latency', showgrid: false, zeroline: false },\n        yaxis: { title: 'Frequency', showline: false },\n        barmode: 'overlay',\n        bargap: 0.05,\n        plot_bgcolor: '#f3f3f3',\n      });\n\n      Plotly.newPlot('latency-summary', [{\n        y: latencies,\n        type: 'box',\n        boxpoints: 'all',\n        jitter: 0.3,\n        pointpos: -1.8,\n      }], {\n        title: 'Latency Summary',\n        yaxis: { title: 'Latency', showline: false },\n        plot_bgcolor: '#f3f3f3',\n      });\n\n      Plotly.newPlot('latency-scatter-plot', [{\n        x: requestNumbers,\n        y: latencies,\n        mode: 'markers',\n        type: 'scatter',\n      }], {\n        title: 'Latency Scatter Plot',\n        xaxis: { title: 'Number of Requests' },\n        yaxis: { title: 'Latency' },\n      });\n    </script>\n  </body>\n  </html>");
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, promises_1.default.writeFile(filePath, htmlContent)];
                case 5:
                    _a.sent();
                    console.log('HTML file has been generated successfully!');
                    return [3 /*break*/, 7];
                case 6:
                    createErr_1 = _a.sent();
                    console.log("Error creating or updating HTML file: ".concat(createErr_1));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.generateHTML = generateHTML;
