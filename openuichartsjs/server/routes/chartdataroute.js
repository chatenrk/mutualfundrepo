const express = require('express');
const router = express.Router();

const chtdatamodel = require('../models/chartdatamodel');


// Route to get scheme details, based on ID
router.get('/allnav', async (req, res, next) => {

  try {
    navdetls = await chtdatamodel.findAll();
    res.send(navdetls);
  } catch (err) {
    return res.status(500).send(err);
  }


});

// Route to get scheme details, based on ID
router.get('/mullinedata', async (req, res, next) => {

  var scode = req.query.scode;

  try {
    navdetls = await chtdatamodel.findAllMulLineData(scode);
    res.send(navdetls);
  } catch (err) {
    return res.status(500).send(err);
  }


});

// Route to get scheme details, based on ID
router.get('/legenddata', async (req, res, next) => {

  try {
    navdetls = await chtdatamodel.getLegendData();
    res.send(navdetls);
  } catch (err) {
    return res.status(500).send(err);
  }


});

// Route to get pie details
router.get('/piedetails', async (req, res, next) => {

  try {
    navdetls = await chtdatamodel.findAllPie();
    res.send(navdetls);
  } catch (err) {
    return res.status(500).send(err);
  }


});


// Route to get pie details
router.get('/projdetails', async (req, res, next) => {

  try {
    navdetls = await chtdatamodel.getProjData();
    res.send(navdetls);
  } catch (err) {
    return res.status(500).send(err);
  }


});





module.exports = router;
