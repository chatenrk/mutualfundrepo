const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const moment = require('moment');




const goalmodel = require('../models/invfor.js');
const config = require('../config/database');
const helpers = require('../helpers/helpers.js');

// Route to get scheme details, based on ID

//Route to find one MF Investment
router.get('/goaldet', async (req,res,next) => {

	debugger;
	var inv_for = req.query.inv_for;


	// Determine which query to use based on passed details

	if(inv_for)
	{

		var query =
		{
			inv_for:inv_for
		}
	}

	else
	{
		return res.status(500).send("Invalid Get Parameters");
	}


	try
	{
		invdet = await goalmodel.findOneGoal(query);
		res.send(invdet);
	}
	catch(err)
	{

		 return res.status(500).send(err);
	}


});


//Route to post a single Investment Detail to database
router.post('/ponegoal', async (req,res,next) => {
	debugger;
//	var invdate = new Date(req.body.invdate).toISOString();

	var mfinvfor = {
			inv_for:req.body.inv_for,
			key:req.body.key,
			text:req.body.text

	};


	try
	{
		invdet = await goalmodel.postOne(mfinvfor);

		res.send(invdet);
	}
	catch(err)
	{

		 return res.status(500).send(err);
	}


});




module.exports = router;
