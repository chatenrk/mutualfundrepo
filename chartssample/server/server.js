const express = require('express');
const app = express();
const path = require('path');

const port = 3000;

app.use(express.static(path.join(__dirname,'../','client')));

app.get('/', function(req,res){
	res.send('Please pass the correct route');
});

app.listen(port);
console.log("listening on port 3000");
