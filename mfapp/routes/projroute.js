const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const projmodel = require('../models/projmodel.js');
const mfinvmodel = require('../models/mfinvmodel.js');


const config = require('../config/database');
const helpers = require('../helpers/helpers.js');
const calchelpers = require('../helpers/calchelpers.js');

/*
New code
*/
// Get all schemes that are relevant for the selected scheme category(Multicap,midcap etc)
router.get('/projschcat', async (req, res, next) => {
  try {

    var schcat = await projmodel.findAllSchCat();

    if (schcat.length > 0) {
      res.send(schcat);
    } else {
      return res.status(200).send("No data found for query");
    }

  } catch (err) {

    return res.status(500).send(err);
  }

});




/*
Code below needs to be relooked if required or not
*/

// Get invested versus current projection
router.get('/invvscurr', async (req, res, next) => {

  /**
   * @desc This is a route for getting the invested versus current value projections that will be used to
   *       display the invested versus current value chart
   * @param scode referring to the scheme code for which this projection is required
   * @return Json array of projections
   */

  var scode = parseInt(req.query.scode);
  var invFor = req.query.invFor;
  var invBy = req.query.invBy;
  var desc;
  var projdetobj = {},
    projdet = [];


  debugger;
  // Get all the investments for a scheme-user-goal
  var query = {
    scode: scode,
    invBy: invBy,
    invFor: invFor
  }
  try {
    var invdet = await mfinvmodel.findOneInvDetUpd(query, desc);

    for (var i = 0; i < invdet.length; i++) {
      projdetobj.amount = invdet[i].amount;
      projdetobj.units = invdet[i].units;
      projdetobj.projdate = helpers.isodatetodate(invdet[i].invdate);

      if (i == 0) {
        projdetobj.totamnt = projdetobj.amount
        projdetobj.totunits = projdetobj.units;


      } else {
        projdetobj.totamnt = projdet[i - 1].totamnt + projdetobj.amount;
        projdetobj.totunits = projdet[i - 1].totunits + projdetobj.units;
      }
      projdetobj.currval = projdetobj.totunits * parseFloat(invdet[i].nav);
      projdet.push(projdetobj);
      projdetobj = {};

      // Check if this is the last loop pass. if so add the current value data
      if (i == invdet.length - 1) {
        debugger;
        var currval = await calchelpers.currval(scode, projdet[i].totunits);
        projdetobj.totamnt = projdet[i].totamnt;
        projdetobj.totunits = projdet[i].totunits;
        projdetobj.currval = currval.currvalamnt;
        projdetobj.projdate = currval.lastNavDate;
        projdet.push(projdetobj);
        projdetobj = {};
      }

    }
    res.send(projdet);

  } catch (err) {

    return res.status(500).send(err);
  }

});


// Get all schemes that are relevant for the selected scheme category(Multicap,midcap etc)
router.get('/schcat', async (req, res, next) => {
  try {

    var schcat = await projmodel.findAll();

    if (schcat.length > 0) {
      res.send(schcat);
    } else {
      return res.status(200).send("No data found for query");
    }

  } catch (err) {

    return res.status(500).send(err);
  }

});

//Route for projection calculations
router.get('/projvalues', async (req, res, next) => {
  debugger;
  var schtype = req.query.schtype;
  var invBy = req.query.invBy;

  if (schtype && schtype != "") {
    var query = {
      schcat: schtype
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


//
// //Route to get all projection schemes based on query
// router.get('/projdet', async (req, res, next) => {
//
//   var schtype = req.query.schtype;
//
//   if (schtype) {
//     var query = {
//       schtype: schtype
//     }
//   } else {
//     return res.status(500).send("Invalid Get Parameters");
//   }
//
//   try {
//     projdet = await projmodel.findAll(query);
//     res.send(projdet);
//   } catch (err) {
//
//     return res.status(500).send(err);
//   }
//
// });
//
//
// //Route to post a single projection entry to database
// router.post('/poneproj', async (req, res, next) => {
//
//   var proj = {
//     scode: req.body.scode,
//     sname: req.body.sname,
//     refscheme: req.body.refscheme,
//     schtype: req.body.schtype
//
//   };
//
//
//   try {
//     projdet = await projmodel.postOne(proj);
//
//     res.send(projdet);
//   } catch (err) {
//
//     return res.status(500).send(err);
//   }
//
//
// });
//
// // Test for future val Check
// router.get('/fvalproj', async (req, res, next) => {
// 	debugger;
// 	var roi = req.query.roi;
// 	var currval = req.query.currval;
// 	var periods = req.query.periods;
//
//   try {
//     fval = projmodel.futureval(roi,currval,periods);
// 		debugger;
//     res.send(String(fval));
//   } catch (err) {
//
//     return res.status(500).send(err);
//   }
// });
//
// // Test for future val Check
// router.get('/xirrproj', async (req, res, next) => {
// 	debugger;
//
//
//   try {
//     fval = projmodel.xirrval();
// 		debugger;
//     res.send(String(fval));
//   } catch (err) {
//
//     return res.status(500).send(err);
//   }
// });
//
// // Calculate Accumulated Corpus
// router.get('/verssip', async (req, res, next) => {
//
// var verssipdata = {}
//     verssipdata.msip = parseFloat(req.query.msip),
//     verssipdata.retpa = parseFloat(req.query.retpa),
//     verssipdata.yinv = parseFloat(req.query.yinv),
//     verssipdata.sipinc = parseFloat(req.query.sipinc);
//
//   try {
//     acccorp = projmodel.verssip(verssipdata);
//
//     res.send(String(acccorp));
//   } catch (err) {
//
//     return res.status(500).send(err);
//   }
// });


// Charts related routes
router.get("/projchartdet", async (req, res, next) => {
  projdet = await projmodel.findAllChartDetls();
  res.send(projdet);
});


router.get('/projpush', async (req, res, next) => {
  var schtype = req.query.schtype;

  if (schtype) {
    var query = {
      schtype: schtype
    }
  } else {
    return res.status(500).send("Invalid Get Parameters");
  }

});

module.exports = router;