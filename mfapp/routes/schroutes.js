const express = require('express');
const router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const schmodel = require('../models/schmodel');
const config = require('../config/database');

//Route to get all schemes
router.get('/all', async (req,res,next) => {
	
	try
	{
		schemes = await schmodel.findAll();
		
		res.send(schemes);
	}
	catch(err)
	{
		
		 return res.status(500).send(err);
	}
	

});

//Route to post a single scheme to database
router.post('/pone', async (req,res,next) => {
	debugger;
	var mfscheme = {
			scode:req.body.scode,
			sname:req.body.sname
	};
	
	
	try
	{
		schemes = await schmodel.postOne(mfscheme);
		debugger;
		res.send(schemes);
	}
	catch(err)
	{
		debugger;
		 return res.status(500).send(err);
	}
	

});

//Route to post a multiple schemes to database
router.post('/pmany', async (req, res) => 
{
	
	debugger;
	try
	{
	
		debugger;
		var mfschemes = req.body;
		var result = await schmodel.postMany(mfschemes);
		res.send(result);
	}
	catch(err)
	{
		debugger;
		return res.status(500).send(err);
	}
});


module.exports = router;