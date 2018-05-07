const express = require('express');
const router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const csv = require('csvtojson');

var multer = require('multer')
var upload = multer({
  dest: 'uploads/'
})


const schmodel = require('../models/schmodel');
const config = require('../config/database');
const helpers = require('../helpers/helpers.js');

// Route to get scheme details, based on ID

//Route to get scheme details based on the query
router.get('/sdet', async (req, res, next) => {


  var scode = req.query.scode;

  var id = {
    scode: scode
  }

  try {
    schemes = await schmodel.findOneSchDet(id);
    res.send(schemes);
  } catch (err) {

    return res.status(500).send(err);
  }


});


//Route to get all scheme by AMC Code
router.get('/sdet/amc', async (req, res, next) => {


  //	var amccode = req.query.amccode;

  var amccode = parseInt(req.query.amccode, 10);

  var id = {
    amccode: amccode
  }

  try {
    schemes = await schmodel.findOneSch(id);
    res.send(schemes);
  } catch (err) {

    return res.status(500).send(err);
  }


});

// Route to insert scheme detail

router.post('/sdet/pone', async (req, res, next) => {


  var mfscheme = {
    scode: req.body.scode,
    sname: req.body.sname,
    category: req.body.category,
    assets: req.body.assets,
    assetdate: req.body.assetdate,
    assetcurr: req.body.assetcurr,
    assetqual: req.body.assetqual,
    expense: req.body.expense,
    expensedate: req.body.expensedate,
    fhouse: req.body.fhouse,
    ldate: req.body.ldate,
    bmark: req.body.bmark,
    risk: req.body.risk,
    return: req.body.return,
    rlaunch: req.body.rlaunch,
    mininv: req.body.mininv,
    minaddinv: req.body.minaddinv,
    minwith: req.body.minwith,
    minswpwith: req.body.minswpwith,
    minbal: req.body.minbal,
    exitload: req.body.exitload,
    ptype: req.body.ptype,
    schtype: req.body.schtype,
    imgpath: req.body.imgpath,
    schurl: req.body.schurl
  };


  try {
    schemes = await schmodel.postOneSchDet(mfscheme);

    res.send(schemes);
  } catch (err) {

    return res.status(500).send(err);
  }


});


//Route to get all schemes
router.get('/all', async (req, res, next) => {

  try {
    schemes = await schmodel.findAll();

    res.send(schemes);
  } catch (err) {

    return res.status(500).send(err);
  }


});

//Route to post a single scheme to database
router.post('/pone', async (req, res, next) => {

  var mfscheme = {
    scode: req.body.scode,
    sname: req.body.sname
  };


  try {
    schemes = await schmodel.postOne(mfscheme);

    res.send(schemes);
  } catch (err) {

    return res.status(500).send(err);
  }


});

//Route to post a multiple schemes to database
router.post('/pmany', async (req, res) => {


  try {

    var mfschemes = req.body;
    var result = await schmodel.postMany(mfschemes);
    res.send(result);
  } catch (err) {

    return res.status(500).send(err);
  }
});


//Route to post a multiple schemes sent via csv
router.post('/csv', upload.single('file'), async (req, res) => {

  if (!req.file)
    return res.status(400).send('No files were uploaded.');

  var mfschemeFile = req.file;

  try {
    var mfschemes = await helpers.csvtojson(mfschemeFile);
    debugger;

    var result = await schmodel.postMany(mfschemes);
    debugger;
    res.send(result);
  } catch (err) {
    debugger;
    return res.status(500).send(err);
  }

});

//Route to post a multiple scheme Details sent via csv
router.post('/csvSchDet', upload.single('file'), async (req, res) => {

  if (!req.file)
    return res.status(400).send('No files were uploaded.');

  var mfschemeFile = req.file;

  try {
    var mfschdet = await helpers.csvtojson(mfschemeFile);
		var result = await schmodel.postManySchDet(mfschdet);

    res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }

});

// Route to update the scheme data in the database
router.post('/pschupdt', async (req, res) => {

  try {
    var mfscheme = req.body;
    var result = await schmodel.postSchUpdt(mfscheme);
    debugger;
    res.send(result);
  } catch (err) {

    return res.status(500).send(err);
  }

});


module.exports = router;
