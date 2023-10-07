const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use((req, res, next) => {
  const xRequestId = req.headers['x-request-id'] || uuidv4(); // Fix typo here 'req.header' to 'req.headers'
  res.set('x-request-id', xRequestId);
  next();
});

// Define allowed origins for clients
const clientXOrigin = 'http://localhost:7000';
const clientYOrigin = 'http://localhost:8000';

// Configure CORS for Client X
const corsOptionsClientX = {
  origin: clientXOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow all methods for Client X
};

// Configure CORS for Client Y
const corsOptionsClientY = {
  origin: clientYOrigin,
  methods: ['GET', 'POST'], // Only allow GET and POST for Client Y
};

app.use('/client-x', cors(corsOptionsClientX)); // Apply CORS for Client X routes
app.use('/client-y', cors(corsOptionsClientY)); // Apply CORS for Client Y routes

app.get('/', (req, res)=>{
  res.send('Ini Udah Jalan ya bro')
})

app.get('/request', (req, res) => {
  console.log(req.headers);
  res.send('Hello World!!!');
});

app.get('/cors', (req, res) => {
  res.json({ message: 'This is a CORS-enabled route global' });
});

// Routes for Client X
app.get('/client-x', (req, res) => {
  res.json({ message: 'This is a CORS-enabled X-client route' });
});

app.post('/client-x', (req, res) => {
  let body = req.body;
  res.json({ message: body });
});
app.delete('/client-x', (req, res) => {
  let body = req.body;
  res.json({ message: body });
});
app.put('/client-x', (req, res) => {
  let body = req.body;
  res.json({ message: body });
});

// Routes for Client Y
app.get('/client-y', (req, res) => {
  res.json({ message: 'This is a CORS-enabled Y-client route' });
});
app.post('/client-y', (req, res) => {
  let body = req.body;
  res.json({ message: body });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
