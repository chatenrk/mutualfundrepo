const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

const users = require('./routes/users');
const schroutes = require('./routes/schroutes');
const config = require('./config/database');

const port = 3000;

mongoose.connect(config.database, {useMongoClient: true});
mongoose.connection.on('connected', function(){
	console.log('Connected to DB '+config.database);
});
mongoose.connection.on('error', function(){
	console.log('Error connecting to DB '+config.database);
})

app.use(cors());

app.use(express.static(path.join(__dirname,'client')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/users',users);
app.use('/schemes',schroutes);

require('./config/passport')(passport);


app.get('/', function(req,res){
	res.send('Please pass the correct route');
});

app.listen(port);
console.log("listening on port 3000");