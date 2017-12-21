const express = require('express');
const router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


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

module.exports = router;