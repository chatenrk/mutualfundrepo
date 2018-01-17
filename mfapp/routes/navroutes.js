const express = require('express');
const router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const csv=require('csvtojson');
const request = require('request');
const moment = require('moment');


var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


const navmodel = require('../models/navModel');
const config = require('../config/database');
const helpers = require('../helpers/helpers.js');

// Route to get scheme details, based on ID

router.get('/navdet', async (req,res,next) => {
	
	debugger;
	var scode = req.query.scode;
	var date = req.query.date;
//	var isodate = new Date(date).toISOString();
	var isodate = moment(date).toISOString();
	var query = {
			
			$and: [{scode:scode},{date:isodate}]
			
			
	}
	
	try
	{
		navdetls = await navmodel.findOneNav(query);
		res.send(navdetls);
	}
	catch(err)
	{
		
		 return res.status(500).send(err);
	}
	

});

router.get('/navbetn', async (req,res,next) => {
	

	var scode = req.query.scode;
	var sdate = req.query.sdate;
	var edate = req.query.edate;
	
	var sdateiso = new Date(sdate).toISOString();
	var edateiso = new Date(edate).toISOString();
	
	var query = {
			
			$and: [
        			{ "scode": scode },
       		        { "date": 
					{
						$gte: sdateiso,
						$lte: edateiso
					}
    			}]
			
			
	}
	
	try
	{
		navdetls = await navmodel.findOneNav(query);
		res.send(navdetls);
	}
	catch(err)
	{
		
		 return res.status(500).send(err);
	}
	

});




//Route to get all nav
router.get('/all', async (req,res,next) => {
	
	try
	{
		navdetls = await navmodel.findAll();
		
		res.send(navdetls);
	}
	catch(err)
	{
		
		 return res.status(500).send(err);
	}
	

});



//Route to post a multiple nav details sent via csv
router.post('/csv', upload.single('file'),async (req, res) => 
{
		
	if (!req.file)
		        return res.status(400).send('No files were uploaded.');
	
	 var navFile = req.file;
	 
	 try
		{	
		 	 var navdetls = await helpers.csvtojson(navFile);
		 	 
		 	 var result = await navmodel.postMany(navdetls);
		 	 
		 	 res.send(result);
		}
		catch(err)
		{
			 return res.status(500).send(err);
		}
	   
});


//Test route 

router.get('/navtest', async (req,res,next) => {
	
	debugger;
	request({
		  'url': 'https://www.google.com',
		  'proxy':'https://proxy.cognizant.com:6050'
		}, function(error, response, body) 
		{
			debugger;
			console.log(body);
		});
});

module.exports = router;