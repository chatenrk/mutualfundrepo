const express = require('express');
const router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const csv=require('csvtojson');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


const mfinvmodel = require('../models/mfinvmodel');
const config = require('../config/database');
const helpers = require('../helpers/helpers.js');

// Route to get scheme details, based on ID

//Route to find one MF Investment
router.get('/mfinvdet', async (req,res,next) => {
	
debugger;
	var scode = req.query.scode;
	var date = req.query.invdate;
	var isodate = new Date(date).toISOString();
	
	// Determine which model to use
	
	var query =
				{
					$and: [{scode:scode},{invdate:isodate}]
				}
	
	try
	{
		invdet = await mfinvmodel.findOneInvDet(query);
		res.send(invdet);
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
		invdets = await mfinvmodel.findAll();
		
		res.send(invdets);
	}
	catch(err)
	{
		
		 return res.status(500).send(err);
	}
	

});

//Route to post a single Investment Detail to database
router.post('/pone', async (req,res,next) => {
	debugger;
	var invdate = new Date(req.body.invdate).toISOString();
	var mfinvdet = {
			amccode:req.body.amccode,
			amcname:req.body.amcname,
			scode:req.body.scode,
			sname:req.body.sname,
			invdate:invdate,
			nav:req.body.nav,
			units:req.body.units,
			amount:req.body.amount,
			remarks:req.body.remarks,
			invFor:req.body.invFor,
			assetType:req.body.assetType,
			invBy:req.body.invBy
	};
	
	
	try
	{
		invdet = await mfinvmodel.postOne(mfinvdet);
		
		res.send(invdet);
	}
	catch(err)
	{
		
		 return res.status(500).send(err);
	}
	

});

////Route to post a multiple schemes to database
//router.post('/pmany', async (req, res) => 
//{
//	
//	
//	try
//	{
//	
//		
//		var mfamcs = req.body;
//		var result = await schmodel.postMany(mfamcs);
//		res.send(result);
//	}
//	catch(err)
//	{
//		
//		return res.status(500).send(err);
//	}
//});
//
//
////Route to post a multiple schemes sent via csv
//router.post('/csv', upload.single('file'),async (req, res) => 
//{
//	
//	
//		
//	if (!req.file)
//		        return res.status(400).send('No files were uploaded.');
//	
//	 var mfamcFile = req.file;
//	 
//	 try
//		{	
//		 	 var mfamcs = await helpers.csvtojson(mfamcFile);
//		 	 
//		 	 var result = await amcmodel.postMany(mfamcs);
//		 	 
//		 	 res.send(result);
//		}
//		catch(err)
//		{
//			 return res.status(500).send(err);
//		}
//	   
//});


module.exports = router;