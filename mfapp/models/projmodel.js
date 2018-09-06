var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var integerValidator = require('mongoose-integer');

var Finance = require('financejs');
var finance = new Finance();

const helpers = require('../helpers/helpers.js');
const calchelpers = require('../helpers/calchelpers.js');
const mfinvmodel = require('../models/mfinvmodel');
const navmodel = require('../models/navModel.js');

var projSchema = mongoose.Schema({
  schcat: String,
  scode: Number,
  sname: String,
  reffund: String
});


var projModel = mongoose.model('projections', projSchema);




//This route finds scheme projection details based on the Query sent
async function findAll(query) {

  try {
    let projdet;
    projdet = await projModel.find(query);
    return projdet;
  } catch (err) {
    return err;
  }
};


//This route posts a single projection to database
async function postOne(proj) {

  try {
    let projres
    var _id = new mongoose.Types.ObjectId();
    projres = await projModel.create({
      scode: proj.scode,
      sname: proj.sname,
      refscheme: proj.refscheme,
      schtype: proj.schtype
    });


    var parseResult = helpers.parseOutput(errflag, projres);

  } catch (err) {

    var operation = err.getOperation();
    var errflag = true;
    var parseResult = helpers.parseOutput(errflag, err, operation);

  }
  return parseResult;
}


//This route posts a multiple projections to database
async function postMany(projs) {

  var resArray = [];
  await helpers.asyncForEach(projs, async (item, index, array) => {
    try {
      result = await postOne(projs[index]);

      resArray.push(result);

    } catch (err) {

      resArray.push(err);

    }
  });

  return resArray;
}

async function getrefSchemeInvDet(refscode, invBy) {

  // Check if there is a scode available to get the all investment details
  if (refscode) {
    var query = {
      $and: [{
        scode: refscode
      }, {
        invBy: invBy
      }]
    }

    try {
      invdet = await mfinvmodel.findOneInvDet(query);
      return invdet;
      // res.send(invdet);
    } catch (err) {
      //  return res.status(500).send(err);
    }
  } else {
    return res.status(200).send("No reference scheme found for query in database");
  }


}

async function returnprojval(projdet, invBy) {

  // Data declarations
  var retobj = {},
    retobjdet = {},
    currscode,
    retarr = [],
    retobjdetarr = [];
  var sinv = 0,
    sunits = 0.00;


  // Find the reference scheme from the lot
  var refscheme = helpers.findInArray(projdet, "reffund", "TRUE");
  var refscode = refscheme.scode;
  var refschinvdet = await getrefSchemeInvDet(refscode, invBy);

  for (var i = 0; i < projdet.length; i++) {
    sinv = 0, sunits = 0.00;
    // Get Last Nav Details
    var lastNav = await navmodel.getLastNav(projdet[i].scode);
    var lastnavval = parseFloat(lastNav[0].lastNavValue);

    retobj.scode = projdet[i].scode;
    retobj.sname = projdet[i].sname;
    if (projdet[i].reffund === "TRUE") {} else {
      currscode = projdet[i].scode;
      // Loop at all entries in reference scheme and populate the details about the projection scheme
      for (var j = 0; j < refschinvdet.length; j++) {

        invdate = refschinvdet[j].invdate;
        amount = refschinvdet[j].amount;
        sinv = sinv + amount;

        // Get NAV Details for date of Processing
        var query = {
          $and: [{
            scode: currscode
          }, {
            date: invdate
          }]
        }
        var navdetls = await navmodel.findOneNav(query);
        var currnav = parseFloat(navdetls[0].nav.value);

        var units = amount / currnav;
        sunits = sunits + units;


        retobjdet.invdate = invdate;
        retobjdet.units = units;
        retobjdet.amount = amount;
        retobjdet.sinv = sinv;
        retobjdet.sunits = units;
        retobjdet.currval = units * lastnavval;
        retobjdetarr.push(retobjdet);
        retobjdet = {};
      }

      retobj.retobjdetarr = retobjdetarr;
      retobjdetarr = [];
      retarr.push(retobj);
      retobj = {};
    }
  }
  return retarr;
}

function futureval(roi, cval, periods) {

  var fval = finance.FV(roi, cval, periods);
  return fval;
}

function xirrval() {

  var xirr = finance.XIRR([5000, 2500, 2500, 2500, 2500, 2500, 2500, -20497], [new Date(2017, 10, 12), new Date(2017, 11, 10), new Date(2017, 12, 11), new Date(2018, 01, 10), new Date(2018, 02, 26), new Date(2018, 03, 13), new Date(2018, 04, 10), new Date(2018, 04, 11)], 0);
  return xirr;
}

function verssip(verssipdata) {
  /**
   * @desc This method is a model method that calculates the accumulated corpus based on the input data
   *       the formula used to Calculate this is as follows
   *       vsip*(12*((1+ret)^(years)-(1+inc+0.00001%)^(years)))/(ret-inc+0.00001%) where
   *       vsip = Monthly investment amount,
   *       ret	= Return expected per annum
   *       years =	Number of years to goal
   *       inc =	Increment percent of monthly investment
   * @param{object} verssipdata referring to parameters of versatile SIP like monthly SIP, return %, increment % and years
   * @return{float} acccorp referring to the accumulated corpus as per the inputs passed
   */

  var acccorp;
  var a, b, c, d, e;
  a = 1 + verssipdata.retpa;
  b = Math.pow(a, verssipdata.yinv);
  // b = calchelpers.scientificToDecimal(Math.pow(a, verssipdata.yinv));
  c = 1 + verssipdata.sipinc + 0.00001
  d = Math.pow(c, verssipdata.yinv);
  e = verssipdata.retpa - verssipdata.sipinc + 0.00001;
  acccorp = calchelpers.scientificToDecimal((12 * verssipdata.msip * (b - d)) / e);

  return acccorp;
}


module.exports.getrefSchemeInvDet = getrefSchemeInvDet;
module.exports.findAll = findAll;
module.exports.postOne = postOne;
module.exports.postMany = postMany;
module.exports.returnprojval = returnprojval;
module.exports.futureval = futureval;
module.exports.xirrval = xirrval;
module.exports.verssip = verssip;
