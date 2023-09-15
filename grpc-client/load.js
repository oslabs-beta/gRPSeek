const grpseek = require('grpseek');
const path = require('path');
const p = path.join(__dirname, 'grpc-client.js');
grpseek(p, 10, 10);
