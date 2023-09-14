import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import cors from 'cors';
const PORT = 8081;
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/** Request for static files */
app.use('/build', express.static(path.join(__dirname, '../build')));


app.get('/requestData', (req, res) => {
  const logFile = 'logs.txt';
  const logData = fs.readFileSync(logFile, 'utf8');
  const lines = logData.split('\n');
  const requestData = lines.map(line => {
    const match = line.match(/Request number (\d+): Call to \/greeterPackage\.Greeter\/SayHello took (\d+) nanoseconds/);
    if (match) {
      return {
        requestNumber: parseInt(match[1], 10),
        latency: parseInt(match[2], 10) / 1e6 // Convert to milliseconds
      };
    }
    return null;
  }).filter(item => item !== null);
  
  
  res.json(requestData);
});
/** Catch-all route handler for unknown routes */
app.use((req, res) => res.status(404).send('Invalid page'));


/** Global error handler */
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middlware error',
    status: 400,
    message: { err: 'An error occurred' },
  };

  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


/** Starting server */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

module.exports = app;