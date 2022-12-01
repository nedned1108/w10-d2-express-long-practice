const express = require('express');
require('express-async-errors');
const app = express();

app.use(express.json())

const dogsRouter = require('./routes/dogs')

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});


// Route handlers
app.use('/dogs', dogsRouter);

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  req.header = ("Content-Type", "application/json")
  req.body = {"color" : "red"}
  res.json(req.body);
  next();
  // finishes the response, res.end()
  res.end()
});

// Logging response method, url path and statusCode

app.get((req, res, next) => {
  console.log(req.method);
  console.log(req.path);
  res.on('finish', () => {
    console.log(res.statusCode)
  })
  // next()
  res.end()
})

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

// Handling Resource not found
app.use('/*',(req, res, next) => {
  const error = new Error("The requested resource couldn't be found")
  error.statusCode = 404
  next(error)
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode;
  const message = err.message
  res.status(statusCode);
  res.json({
    message,
    statusCode
  })
})

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
