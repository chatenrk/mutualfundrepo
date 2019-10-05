const express = require('express');
const path = require('path');
const cors = require('cors');

const chtdata = require('./routes/chartdataroute');

const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to MongoDB using mongoose to retrieve data
mongoose.connect(config.database);
mongoose.connection.on('connected', function() {
  console.log('Connected to DB ' + config.database);
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to DB ' + config.database);
});

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, '../client')));
app.use('/chtdata', chtdata);

app.get('/', function(req, res) {
  res.send('Please pass the correct route');
});

app.listen(port);
console.log('listening on port 3000');
