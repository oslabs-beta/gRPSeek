const path = require('path');
const workerScriptPath = path.join(__dirname, './greeter_client.js');
const timer = require('grpseek');
timer(workerScriptPath, 5, 5);
