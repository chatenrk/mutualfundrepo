// Declaration for node JS
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const port = 3000;

// Local files import
const config = require('./config/database');
const routes = require('./routes/routes');

// Connect to MongoDB via Mongoose for data exchange
mongoose.connect(config.database);
mongoose.connection.on('connected', function(){
	console.log('Connected to DB '+config.database);
});
mongoose.connection.on('error', function(){
	console.log('Error connecting to DB '+config.database);
})

// To overcome CORS issue
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});


// Define client path to load frontend files
app.use(express.static(path.join(__dirname,'../','client')));

app.use('/qauth',routes);

app.get('/', function(req,res){
	res.send('Please pass the correct route');
});

//Listener config
app.listen(port);
console.log("listening on port 3000");
