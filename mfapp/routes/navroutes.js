const express = require('express');
const router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const csv = require('csvtojson');
const request = require('request');
const moment = require('moment');


var multer = require('multer')
var upload = multer({
  dest: 'uploads/',
  limits: {
    fieldSize: 25 * 1024 * 1024
  }
})


const navmodel = require('../models/navModel');
const config = require('../config/database');
const helpers = require('../helpers/helpers.js');

// Route to get scheme details, based on ID
router.get('/navdet', async (req, res, next) => {


  var scode = req.query.scode;
  var date = req.query.date;
  //	var isodate = new Date(date).toISOString();
  var isodate = moment(date).toISOString();
  var query = {

    $and: [{
      scode: scode
    }, {
      date: isodate
    }]


  }

  try {
    navdetls = await navmodel.findOneNav(query);
    res.send(navdetls);
  } catch (err) {
    return res.status(500).send(err);
  }


});

router.get('/navbetn', async (req, res, next) => {


  var scode = req.query.scode;
  var sdate = req.query.sdate;
  var edate = req.query.edate;

  var sdateiso = new Date(sdate).toISOString();
  var edateiso = new Date(edate).toISOString();

  var query = {

    $and: [{
        "scode": scode
      },
      {
        "date": {
          $gte: sdateiso,
          $lte: edateiso
        }
      }
    ]


  }

  try {
    navdetls = await navmodel.findOneNav(query);
    res.send(navdetls);
  } catch (err) {

    return res.status(500).send(err);
  }


});




//Route to get all nav
router.get('/all', async (req, res, next) => {

  try {
    navdetls = await navmodel.findAll();

    res.send(navdetls);
  } catch (err) {

    return res.status(500).send(err);
  }


});

// Get NAV documents based on limit supplied
router.get('/navlimit', async (req, res) => {

  var scode = req.query.scode;
  var limit = req.query.limit;
  var sorder = req.query.sorder;

  if (scode === "") {
    return res.status(500).send("Please mention Scheme Code");
  }

  if (!limit) {
    limit = 10;
	}
	else{
		limit = parseInt(limit);
  }

  if (!sorder) {
    sorder = "DSC";
  }


  var query = {
    "scode": scode
  }


  try {
    navdetls = await navmodel.findNNAV(query,limit,sorder);
    res.send(navdetls);
  } catch (err) {

    return res.status(500).send(err);
  }


});

router.post('/navpost', async (req, res) => {

  // if (!req.file)
  // 					return res.status(400).send('No files were uploaded.');
  try {
    let results;
    results = await navmodel.postMany(narray);

    res.json(results);
  } catch (err) {
    res.send(err);
  }

});

//Route to post a multiple nav details sent via a text / csv file
router.post('/navfile', upload.single('file'), async (req, res) => {

  // var narray = [];
  if (!req.file)
    return res.status(400).send('No files were uploaded.');

  var navFile = req.file;

  if (navFile.mimetype === 'text/plain') {
    // process the Text file
    try {
      var narray = helpers.parsetextNAV(navFile.originalname);

      try {
        let results;
        results = await navmodel.postMany(narray);

        res.json(results);
      } catch (err) {
        res.send(err);
      }


      // res.send(narray);

    } catch (err) {

      return res.status(500).send(err);
    }
  } else if (navFile.mimetype === 'text/csv') {
    // process the CSV file
    try {
      var navdetls = await helpers.csvtojson(navFile);
      var result = await navmodel.postMany(navdetls);
      res.send(result);
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(400).send('File type is not supported');
  }
});


//Test route

router.get('/navtest', async (req, res, next) => {


  request({
    'url': 'https://www.google.com',
    'proxy': 'https://proxy.cognizant.com:6050'
  }, function(error, response, body) {

    console.log(body);
  });
});

module.exports = router;
