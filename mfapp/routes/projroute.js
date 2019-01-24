const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const projmodel = require("../models/projmodel.js");

const config = require("../config/database");
const helpers = require("../helpers/helpers.js");

//Route for projection calculations
router.get("/projvalues", async (req, res, next) => {
 
  var schcat = req.query.schcat;
  var invBy = req.query.invBy;

  if (schcat) {
    var query = {
      schcat: schcat
    };
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
router.get("/projdet", async (req, res, next) => {
  var schtype = req.query.schtype;

  if (schtype) {
    var query = {
      schtype: schtype
    };
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
router.post("/poneproj", async (req, res, next) => {
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

// Charts related routes
router.get("/projchartdet", async (req, res, next) => {
  projdet = await projmodel.findAllChartDetls();
  res.send(projdet);
});

module.exports = router;
