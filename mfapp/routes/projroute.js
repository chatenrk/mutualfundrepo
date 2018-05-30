const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const projmodel = require('../models/projmodel.js');


const config = require('../config/database');
const helpers = require('../helpers/helpers.js');

//Route for projection calculations
router.get('/projvalues', async (req, res, next) => {
  debugger;
  var schtype = req.query.schtype;
  var invBy = req.query.invBy;

  if (schtype) {
    var query = {
      schtype: schtype
    }
  } else {
    return res.status(500).send("Invalid Get Parameters");
  }

  try {
    projdet = await projmodel.findAll(query);

    if (projdet.length > 0) {

      var retarr = await projmodel.returnprojval(projdet, invBy);
      res.send(retarr);
    } else {
      return res.status(200).send("No data found for query");
    }
  } catch (err) {

    return res.status(500).send(err);
  }


});

//Route to get all projection schemes based on query
router.get('/projdet', async (req, res, next) => {

  var schtype = req.query.schtype;

  if (schtype) {
    var query = {
      schtype: schtype
    }
  } else {
    return res.status(500).send("Invalid Get Parameters");
  }

  try {
    projdet = await projmodel.findAll(query);
    res.send(projdet);
  } catch (err) {

    return res.status(500).send(err);
  }

});


//Route to post a single projection entry to database
router.post('/poneproj', async (req, res, next) => {

  var proj = {
    scode: req.body.scode,
    sname: req.body.sname,
    refscheme: req.body.refscheme,
    schtype: req.body.schtype

  };


  try {
    projdet = await projmodel.postOne(proj);

    res.send(projdet);
  } catch (err) {

    return res.status(500).send(err);
  }


});

// Test for future val Check
router.get('/fvalproj', async (req, res, next) => {
	debugger;
	var roi = req.query.roi;
	var currval = req.query.currval;
	var periods = req.query.periods;

  try {
    fval = projmodel.futureval(roi,currval,periods);
		debugger;
    res.send(String(fval));
  } catch (err) {

    return res.status(500).send(err);
  }
});

// Test for future val Check
router.get('/xirrproj', async (req, res, next) => {
	debugger;


  try {
    fval = projmodel.xirrval();
		debugger;
    res.send(String(fval));
  } catch (err) {

    return res.status(500).send(err);
  }
});

// Calculate Accumulated Corpus
router.get('/verssip', async (req, res, next) => {

var verssipdata = {}
    verssipdata.msip = parseFloat(req.query.msip),
    verssipdata.retpa = parseFloat(req.query.retpa),
    verssipdata.yinv = parseFloat(req.query.yinv),
    verssipdata.sipinc = parseFloat(req.query.sipinc);

  try {
    acccorp = projmodel.verssip(verssipdata);

    res.send(String(acccorp));
  } catch (err) {

    return res.status(500).send(err);
  }
});

module.exports = router;
