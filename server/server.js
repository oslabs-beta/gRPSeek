"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var fs_1 = __importDefault(require("fs"));
var cors_1 = __importDefault(require("cors"));
var PORT = 8081;
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
/** Request for static files */
app.use('/build', express_1.default.static(path_1.default.join(__dirname, '../build')));
app.get('/requestData', function (req, res) {
    var logFile = 'logs.txt';
    var logData = fs_1.default.readFileSync(logFile, 'utf8');
    var lines = logData.split('\n');
    var requestData = lines.map(function (line) {
        var match = line.match(/Request number (\d+): Call to \/greeterPackage\.Greeter\/SayHello took (\d+) nanoseconds/);
        if (match) {
            return {
                requestNumber: parseInt(match[1], 10),
                latency: parseInt(match[2], 10) / 1e6 // Convert to milliseconds
            };
        }
        return null;
    }).filter(function (item) { return item !== null; });
    res.json(requestData);
});
/** Catch-all route handler for unknown routes */
app.use(function (req, res) { return res.status(404).send('Invalid page'); });
/** Global error handler */
app.use(function (err, req, res, next) {
    var defaultErr = {
        log: 'Express error handler caught unknown middlware error',
        status: 400,
        message: { err: 'An error occurred' },
    };
    var errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});
/** Starting server */
app.listen(PORT, function () {
    console.log("Server listening on port: ".concat(PORT, "..."));
});
module.exports = app;
