const express = require('express');
const router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const csv=require('csvtojson');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


const amcmodel = require('../models/amcmodel');
const config = require('../config/database');
const helpers = require('../helpers/helpers.js');

// Route to get scheme details, based on ID

//Route to find one AMC
router.get('/amcdet', async (req,res,next) => {
	
	debugger;
	var amccode = req.query.amccode;
	
	var id = {
			amccode:amccode
	}
	
	try
	{
		amc = await amcmodel.findOneAMC(id);
		res.send(amc);
	}
	catch(err)
	{
		
		 return res.status(500).send(err);
	}
	

});




//Route to get all amcs
router.get('/all', async (req,res,next) => {
	
	try
	{
		amcs = await amcmodel.findAll();
		
		res.send(amcs);
	}
	catch(err)
	{
		
		 return res.status(500).send(err);
	}
	

});

//Route to post a single amc to database
router.post('/pone', async (req,res,next) => {
	
	var mfamc = {
			scode:req.body.amccode,
			sname:req.body.amcname
	};
	
	
	try
	{
		amcs = await amcmodel.postOne(mfamc);
		
		res.send(amcs);
	}
	catch(err)
	{
		
		 return res.status(500).send(err);
	}
	

});

//Route to post a multiple schemes to database
router.post('/pmany', async (req, res) => 
{
	
	
	try
	{
	
		
		var mfamcs = req.body;
		var result = await schmodel.postMany(mfamcs);
		res.send(result);
	}
	catch(err)
	{
		
		return res.status(500).send(err);
	}
});


//Route to post a multiple schemes sent via csv
router.post('/csv', upload.single('file'),async (req, res) => 
{
	
	debugger;
		
	if (!req.file)
		        return res.status(400).send('No files were uploaded.');
	
	 var mfamcFile = req.file;
	 
	 try
		{	
		 	 var mfamcs = await helpers.csvtojson(mfamcFile);
		 	 
		 	 var result = await amcmodel.postMany(mfamcs);
		 	 
		 	 res.send(result);
		}
		catch(err)
		{
			 return res.status(500).send(err);
		}
	   
});


module.exports = router;