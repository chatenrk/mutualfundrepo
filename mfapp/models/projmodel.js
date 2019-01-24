var mongoose = require("mongoose");
require("mongoose-double")(mongoose);
var integerValidator = require("mongoose-integer");

const helpers = require("../helpers/helpers.js");
const mfinvmodel = require("../models/mfinvmodel");
const navmodel = require("../models/navModel.js");

var projSchema = mongoose.Schema({
  schcat: String,
  scode: Number,
  sname: String,
  reffund: String
});

var projModel = mongoose.model("projections", projSchema);

//This route finds scheme projection details based on the Query sent
async function findAll(query) {
  try {
    let projdet;
    projdet = await projModel.find(query);
    return projdet;
  } catch (err) {
    return err;
  }
}

//This route posts a single projection to database
async function postOne(proj) {
  try {
    let projres;
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
      $and: [{ scode: refscode }, { invBy: invBy }]
    };

    try {
      invdet = await mfinvmodel.findOneInvDet(query);
      return invdet;
      // res.send(invdet);
    } catch (err) {
      //  return res.status(500).send(err);
    }
  } else {
    return res
      .status(200)
      .send("No reference scheme found for query in database");
  }
}

async function returnprojval(projdet, invBy) {
  var retobj = {},
    retarr = [];
  var sumamnt=0, sunits=0;

  // Find the reference scheme from the lot
  var refscheme = helpers.findInArray(projdet, "reffund", "TRUE");
  var refscode = refscheme.scode;
  var refschinvdet = await getrefSchemeInvDet(refscode, invBy);

  // For all investments in reference scheme, make a table for all the projection schemes, including
  // the reference scheme

  for (var i = 0; i < refschinvdet.length; i++) {
    invdate = refschinvdet[i].invdate;

    amount = refschinvdet[i].amount;
    // sumamnt = sumamnt + amount;

    for (var j = 0; j < projdet.length; j++) {
      currscode = projdet[j].scode;
      currsname = projdet[j].sname;
      
      // Get NAV for that date and scode
      var query = {
        $and: [{ scode: currscode }, { date: invdate }]
      };

      var navdetls = await navmodel.findOneNav(query);
      var currnav = parseFloat(navdetls[0].nav.value);
      var units = amount / currnav;
     

      // totval = sunits * currnav;
      // gainloss = totval - sumamnt;

      // Log everything into return array
      retobj.scode = currscode;
      retobj.sname = currsname;
      retobj.invdate = invdate;
      retobj.amount = amount;
      // retobj.sumamnt = sumamnt;
      retobj.nav = currnav;
      retobj.units = units;
      // retobj.totval = totval;
      // retobj.gainloss = gainloss;
      retarr.push(retobj);
      retobj = {};
      
    }
  }

  return retarr;

  // for (var i = 0; i < projdet.length; i++) {
  //   if (projdet[i].reffund === "TRUE") {

  //     // Find last NAV in database for the scheme
  //     var lastNav = await navmodel.getLastNav(refscode);
  //     var lastnavval = parseFloat(lastNav[0].lastNavValue);

  //     //Find sum of investments
  //     var sinv = helpers.sumtotal(refschinvdet, "amount");
  //     // Find sum of units
  //     var sunits = helpers.sumtotal(refschinvdet, "units");

  //     // Total actual amount
  //     var invval = lastnavval * sunits;

  //     //Fill all of the details into return json
  //     retobj.refscheme = refscheme;
  //     retobj.lastNavDate = lastNav[0].lastNavDate;
  //     retobj.sinv = sinv;
  //     retobj.sunits = sunits;
  //     retobj.invval = invval;
  //   } else {
  //     // For all investments in refschinvdet, we need to find the corresponding NAV for the scode

  //     currscode = projdet[i].scode;
  //     var sinv = 0,
  //       sunits = 0.0;
  //     for (var j = 0; j < refschinvdet.length; j++) {
  //       invdate = refschinvdet[j].invdate;
  //       amount = refschinvdet[j].amount;
  //       sinv = sinv + amount;
  //
  //       var navdetls = await navmodel.findOneNav(query);
  //       var currnav = parseFloat(navdetls[0].nav.value);

  //       var units = amount / currnav;
  //       sunits = sunits + units;
  //     }
  //   }
  // }
  // retarr.push(retobj);
  // return retarr;
}

// Chart related models
var SchemaTypes = mongoose.Schema.Types;
var projChartsSchema = mongoose.Schema({
  ftype: String,
  fname: String,
  invdate: String,
  invamnt: {
    type: Number,
    integer: true
  },
  totamnt: {
    type: Number,
    integer: true
  },
  nav: SchemaTypes.Double,
  units: SchemaTypes.Double,
  totunits: SchemaTypes.Double,
  currval: {
    type: Number,
    integer: true
  },
  gainloss: {
    type: Number,
    integer: true
  }
});
projChartsSchema.plugin(integerValidator);
var projChartsModel = mongoose.model("projcharts", projSchema);

async function findAllChartDetls() {
  try {
    let projdet;

    projdet = await projChartsModel.aggregate([
      {
        $group: {
          _id: { ftype: "$ftype", fname: "$fname" },
          invdet: { $push: "$$ROOT" }
        }
      },
      {
        $group: {
          _id: "$_id.ftype",
          fdata: { $push: "$$ROOT" }
        }
      }
    ]);

    // projdet = await projChartsModel.aggregate([

    //   {
    //     $group: {
    //       _id: "$ftype",
    //       count: { $sum: 1 },
    //       invdet: { $push: "$$ROOT" }
    //     }
    //   }
    //   //
    // ]);

    // projdet = await projChartsModel.find();
    return projdet;
  } catch (err) {
    return err;
  }
}

module.exports.getrefSchemeInvDet = getrefSchemeInvDet;
module.exports.findAll = findAll;
module.exports.postOne = postOne;
module.exports.postMany = postMany;
module.exports.returnprojval = returnprojval;
module.exports.findAllChartDetls = findAllChartDetls;
