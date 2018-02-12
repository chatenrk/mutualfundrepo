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

// Route for Step-up sip calculation
router.get('/ssipcalc', async (req,res,next) => {

	if(req.query.msip !== "" && req.query.ret!==""&&req.query.inc!==""&&req.query.yrs!=="")
	{
		debugger;
		var ssipval = {},yrlyinv = {},ssiparr = [];
		var retfact,incfact,retincdiff,totinv=0;
		var initamnt = req.query.msip*12;
		var incamnt = initamnt*(req.query.inc/100);
		var ret = req.query.ret/100;
		var inc = req.query.inc/100;
// Total Investment amount
		for(var i=0;i<req.query.yrs;i++)
		{
			yrlyinv.year = i+1;
			yrlyinv.invamnt = (initamnt)+(i*incamnt);
			ssiparr.push(yrlyinv) ;
			totinv = totinv + yrlyinv.invamnt;
			yrlyinv = {};
		}
		debugger;
		ssipval.years = ssiparr;
// Final Amount
		ssipval.totinv = totinv;

		if(ret === inc)
		{
			ret=ret+.00001;
		}

		retfact = Math.pow(1+(ret),req.query.yrs);
		incfact = Math.pow(1+(inc),req.query.yrs);
		retincdiff = ((ret)-(inc));

		ssipval.stepupamt = Math.round((req.query.msip)*((12*(retfact-incfact)/retincdiff)));
		res.send(ssipval);
	}
	else
	{
		return res.status(500).send("Please pass all requisite parameters");
	}

});

// Route for Future value calculation
router.get('/fvalcalc', async (req,res,next) => {
debugger;
	if(req.query.pcost !== "" && req.query.infl!==""&&req.query.yrs!=="")
	{

		var fval = {}

		fval.futurevalue = Math.round(req.query.pcost * Math.pow(1+(req.query.infl/100),req.query.yrs));

		res.send(fval);
	}
	else
	{
		return res.status(500).send("Please pass all requisite parameters");
	}

});

// Route for Goal Planner
router.get('/gplanner', async (req,res,next) => {
// 
// //Years to goal
// if(req.query.ygoal == "")
// {
// 	return res.status(500).send("Please pass Years to goal parameter");
// }
// else
// {
// 		ygoal = req.query.ygoal;
// }
//
// //Present Cost
// if(req.query.pcost == "")
// {
// 	return res.status(500).send("Please pass Present Cost parameter");
// }
// else
// {
// 		pcost = req.query.pcost;
// }
//
// //Inflation
// if(req.query.infl == "")
// {
// 	return res.status(500).send("Please pass Inflation parameter");
// }
// else
// {
// 		infl = (req.query.infl/100);
// }
//
// //Expected Rate of return on future inv
// if(req.query.errfinv == "")
// {
// 	return res.status(500).send("Please pass Expected Rate of return on Future Investment parameter");
// }
// else
// {
// 	errfinv = (req.query.errfinv/100);
// }
//
// //Future Cost
// var fcost = pcost*(Math.pow((1+infl),ygoal));
//
// //Amount Invested
// if(req.query.ainv == "")
// {
// 	return res.status(500).send("Please pass Amount Invested parameter");
// }
// else
// {
// 		ainv = req.query.ainv;
// }
//
//
// //Expected Rate of return on Curr inv
// if(req.query.errcinv == "")
// {
// 	return res.status(500).send("Please pass Expected Rate of return on Current Investment parameter");
// }
// else
// {
// 	errcinv = (req.query.errcinv/100);
// }
//
// //Future Value of curr inv
// var fcost = ainv*(Math.pow((1+errcinv),ygoal));
//
// // Amount for goal required
// (fval - fcost)

/// Formula used
// B3 = Present cost
// B4 = inflation
// B2 = Years to goal
// B7 = Curr value of inv
// B8 = Expected return on curr inv
//
//
// (gcorpus-fvcurr)*(retg-incg+0.00001%)/((12*((1+retg)^(yearsg)-(1+incg+0.00001%)^(yearsg)))))
// Gcorpus = Future cost(calc as B3*(1+B4)^B2)
// fvcurr = Future value of curr inv (calc as B7*(1+B8)^B2)
// retg = Expected return
// incg = Expected increment per annum
// yearsg = Years to goal
});

module.exports = router;
