const express = require("express");
const router = express.Router();
var passport = require("passport");
var jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const csv = require("csvtojson");
const cheerio = require("cheerio");

const moment = require("moment");

var request = require("request").defaults({
  proxy: "http://proxy.cognizant.com:6050",
  agent: false,
  rejectUnauthorized: false
});

var multer = require("multer");
var upload = multer({
  dest: "uploads/",
  limits: {
    fieldSize: 25 * 1024 * 1024
  }
});

const navmodel = require("../models/navModel");
const config = require("../config/database");
const helpers = require("../helpers/helpers.js");

// Route to get scheme details, based on ID

router.get("/navdet", async (req, res, next) => {
  var scode = req.query.scode;
  var date = req.query.date;
  //	var isodate = new Date(date).toISOString();
  var isodate = moment(date).toISOString();
  var query = {
    $and: [
      {
        scode: scode
      },
      {
        date: isodate
      }
    ]
  };

  try {
    navdetls = await navmodel.findOneNav(query);
    res.send(navdetls);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/navbetn", async (req, res, next) => {
  var scode = req.query.scode;
  var sdate = req.query.sdate;
  var edate = req.query.edate;

  var sdateiso = new Date(sdate).toISOString();
  var edateiso = new Date(edate).toISOString();

  var query = {
    $and: [
      {
        scode: scode
      },
      {
        date: {
          $gte: sdateiso,
          $lte: edateiso
        }
      }
    ]
  };

  try {
    navdetls = await navmodel.findOneNav(query);
    res.send(navdetls);
  } catch (err) {
    return res.status(500).send(err);
  }
});

//Route to get all nav
router.get("/all", async (req, res, next) => {
  try {
    navdetls = await navmodel.findAll();

    res.send(navdetls);
  } catch (err) {
    return res.status(500).send(err);
  }
});

// Get NAV documents based on limit supplied
router.get("/navlimit", async (req, res) => {
  var scode = req.query.scode;
  var limit = req.query.limit;
  var sorder = req.query.sorder;

  if (scode === "") {
    return res.status(500).send("Please mention Scheme Code");
  }

  if (!limit) {
    limit = 10;
  } else {
    limit = parseInt(limit);
  }

  if (!sorder) {
    sorder = "DSC";
  }

  var query = {
    scode: scode
  };

  try {
    navdetls = await navmodel.findNNAV(query, limit, sorder);
    res.send(navdetls);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/navpost", async (req, res) => {
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
router.post("/navfile", upload.single("file"), async (req, res) => {
  // var narray = [];
  if (!req.file) return res.status(400).send("No files were uploaded.");

  var navFile = req.file;

  if (navFile.mimetype === "text/plain") {
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
  } else if (navFile.mimetype === "text/csv") {
    // process the CSV file
    try {
      var navdetls = await helpers.csvtojson(navFile);
      var result = await navmodel.postMany(navdetls);
      res.send(result);
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(400).send("File type is not supported");
  }
});

// Read details automatically from AMFI using the AMC date and From / To dates

router.get("/amfiretr", async (req, res, next) => {
  var mf = "mf=";
  var mfnum = mf.concat(req.query.mfnum);
  var tp = "&tp=1";
  var frmdtstr = "&frmdt=";
  var frmdt = frmdtstr.concat(req.query.frmdt);
  var todtstr = "&todt=";
  var todt = todtstr.concat(req.query.todt);

  var staticurl =
    "http://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?";

  var url = staticurl.concat(mfnum, tp, frmdt, todt);

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      navjson = helpers.convtojson(body, true);
      stats = navmodel.postManyNew(navjson);
      res.send(stats);
    } else {
      res.error(error);
    }
  });
});

router.get("/valrestest", async (req, res, next) => {
  // var mf = "mf=";
  // var mfnum = mf.concat(req.query.mfnum);
  // var tp = "&tp=1";
  // var frmdtstr = "&frmdt=";
  // var frmdt = frmdtstr.concat(req.query.frmdt);
  // var todtstr = "&todt=";
  // var todt = todtstr.concat(req.query.todt);

  var staticurl =
    "https://www.valueresearchonline.com/funds/newsnapshot.asp?schemecode=16008";

  // var url = staticurl.concat(mfnum, tp, frmdt, todt);

  request(staticurl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var extrData = {};
      var strippedBody = body.replace(/<!--[\s\S]*?-->/g, "");
      var assets;

      var $ = cheerio.load(strippedBody);

      // Fund name Extraction
      $("span.fundname_rating_sep").each(function(i, element) {
        extrData["fundName"] = this.firstChild.data;
      });

      // Scheme Code Extraction
      $("input#SchemeCode").each(function(i, element) {
        extrData[element.attribs.id] = element.attribs.value;
      });

      // Fund Details Table
      $(".fund-detail").each(function(i, element) {
        var table = element.childNodes[1];
        var tbody = table.childNodes[1];

        // Fund Category
        extrData[tbody.children[0].children[1].children[0].data] =
          tbody.children[0].children[3].children[0].children[0].data;

        // Assets
        var assetsArr = tbody.children[2].children[3].children[2].data.split(
          "\n"
        );

        extrData[tbody.children[2].children[1].children[0].data] =
          assetsArr[1].trim() +
          " " +
          assetsArr[2].trim() +
          " " +
          assetsArr[3].trim();

        // Expenses
        var expArr = tbody.children[4].children[3].children[0].data.split("\n");
        extrData[tbody.children[4].children[1].children[0].data] =
          expArr[1].trim() + " " + expArr[2].trim();
      });


      // Fund Basic Details Table
       $(".fund-snapshot-basic-details-equity").each(function(i, element) {
        tbody = element.children[1]
       });

       // Fund Investment Details Table
       $(".fund-snapshot-investment-details-equity").each(function(i, element) {
        tbody = element.children[1];
       }); 

       // Fund Performance Table
       $("table.fund-snapshot-performance-equity").each(function(i, element) {
        tbody = element.children[1];
       });

      res.send(extrData);
    } else {
      res.error(error);
    }
  });
});

module.exports = router;
