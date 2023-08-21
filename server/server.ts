const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const PORT = 8082;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/** Request for static files */
app.use('/build', express.static(path.join(__dirname, '../build')));

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