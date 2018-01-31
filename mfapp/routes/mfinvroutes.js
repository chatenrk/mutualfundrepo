const express = require('express');
const router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const csv=require('csvtojson');
const moment = require('moment');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


const mfinvmodel = require('../models/mfinvmodel');
const config = require('../config/database');
const helpers = require('../helpers/helpers.js');

// Route to get scheme details, based on ID

//Route to find one MF Investment
router.get('/mfinvdet', async (req,res,next) => {


	var scode = req.query.scode;
	var date = req.query.invdate;
	var invBy = req.query.invBy;

	// Determine which query to use based on passed details

	if(date)
	{
		var isodate = new Date(date).toISOString();
		var query =
		{
			$and: [{scode:scode},{invdate:isodate}]
		}
	}
	else if(invBy&&scode)
	{
		var query =
		{
			$and: [{scode:scode},{invBy:invBy}]
		}
	}
	else if(invBy&&sname)
	{
		var query =
		{
			$and: [{sname:sname},{invBy:invBy}]
		}
	}
	else if(invBy)
	{
		var query =
		{
			invBy:invBy
		}
	}
	else
	{
		return res.status(500).send("Invalid Get Parameters");
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
//	var invdate = new Date(req.body.invdate).toISOString();
	var invdate = moment(req.body.invdate).toISOString();
	var mfinvdet = {
			transaction:req.body.transaction,
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

//Route for aggregations
router.get('/aggr', async (req,res,next) => {

if(req.query.id !== "" && req.query.totcol !==""&&req.query.invBy!=="")
{
	var aggr = {}
	aggr.id = req.query.id;
	aggr.totcol = req.query.totcol;
	aggr.invBy = req.query.invBy;
	var aggrres = await mfinvmodel.getAggregation(aggr);
	res.send(aggrres);
}
else
{
	return res.status(500).send("Improperly formed Aggregation query");
}




});


module.exports = router;
