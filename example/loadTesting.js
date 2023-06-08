const workerScriptPath = './greeter_client.js';
const loadTest = require('grpseek')
loadTest('./greeter_client.js', 100, 10)
