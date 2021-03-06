/*
------------------------------------------------------------------------------------------------------------------------
* Declarations
------------------------------------------------------------------------------------------------------------------------
*/
var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var integerValidator = require('mongoose-integer');

const helpers = require('../helpers/helpers.js');
const calchelpers = require('../helpers/calchelpers.js');

/*
------------------------------------------------------------------------------------------------------------------------
* Schema and Model Definition
------------------------------------------------------------------------------------------------------------------------
*/

var SchemaTypes = mongoose.Schema.Types;
var mfinvSchema = mongoose.Schema({
  transaction: String,
  amccode: Number,
  amcname: String,
  scode: Number,
  sname: String,
  invdate: Date,
  nav: SchemaTypes.Double,
  units: SchemaTypes.Double,
  amount: {
    type: Number,
    integer: true
  },
  remarks: String,
  invFor: String,
  assetType: String,
  invBy: String
});

mfinvSchema.plugin(integerValidator);
var mfinvModel = mongoose.model('mfinvdetl', mfinvSchema);


/********************************************************************************************************
 * Temporary schema and Models for Investments. To be cleaned up later 
 *******************************************************************************************************/
var mfinvSchemaTemp = mongoose.Schema({
  Date: String,
  Month:String,
  Year:Number,
  Transaction: String,
  scode: Number,
  FundName: String,
  amccode: Number,
  amcname: String,
  Investment: {
    type: Number,
    integer: true
  },
  nav: SchemaTypes.Double,
  remarks: String,
  Portfolio: String,
  InvestFor:String,
  AssetType:String,
  VRClass:String
});

mfinvSchemaTemp.plugin(integerValidator);
var mfinvModelTemp = mongoose.model('mfinvtempdetls', mfinvSchemaTemp);

/*
------------------------------------------------------------------------------------------------------------------------
* Get Data Methods
------------------------------------------------------------------------------------------------------------------------
*/
//This route gets all the documents inside the schemes collection in MongoDB
async function findAll() {
  try {
    let invdet
    invdet = await mfinvModel.find();

    return invdet;
  } catch (err) {

    return err;
  }
};


//This route finds Investment Details based on the Query sent
async function findOneInvDet(query, desc) {
  try {
    let invdet;

    if (desc === "") {
      invdet = await mfinvModel.find(query).sort({
        amcname: 1,
        sname: 1
      });
    } else {
      invdet = await mfinvModel.find(query).sort({
        amcname: 1,
        sname: 1,
        invdate: -1
      });
    }
    return invdet;
  } catch (err) {

    return err;
  }
};


//This route finds Investment Details based on the Query sent
async function findOneInvDetUpd(query, desc) {
  try {
    let invdet;
    debugger;
    if (!desc || desc === "") {

      invdet = await mfinvModel.aggregate([{
          $match: query
        },
        {
          $lookup: {
            from: "schemes",
            localField: "scode",
            foreignField: "scode",
            as: "schemesLU"
          }
        },
        {
          $sort: {
            amcname: 1,
            sname: 1
          }
        }
      ]);

    } else {

      invdet = await mfinvModel.aggregate([{
          $match: query
        },
        {
          $lookup: {
            from: "schemes",
            localField: "scode",
            foreignField: "scode",
            as: "schemesLU"
          }
        },
        {
          $sort: {
            amcname: 1,
            sname: 1,
            invdate: -1
          }
        }
      ]);



    }
    return invdet;
  } catch (err) {

    return err;
  }
};


/********************************************************************************************************
 * Temporary functions. To be cleaned up later 
 *******************************************************************************************************/
async function findAllTemp() {
  try {
    let invdet
    invdet = await mfinvModelTemp.find();

    return invdet;
  } catch (err) {

    return err;
  }
};



/*
------------------------------------------------------------------------------------------------------------------------
* Post Data Methods
------------------------------------------------------------------------------------------------------------------------
*/
//This route posts a single Inv Detail to database
async function postOne(mfinvdet, user) {
  debugger;

  var naverrflag = false;
  var naverr = {},
    navoprn = {};

  // If user is not available use the one passed in the arguments
  if (!mfinvdet.invBy || mfinvdet.invBy === "") {
    mfinvdet.invBy = user;
  }

  // Check if the NAV is supplied, incase of multipost it is not supplied and has to be retrieved here
  if (!mfinvdet.nav || mfinvdet.nav === "") {

    var isodate = helpers.datetoisodate(mfinvdet.invdate); //moment(mfinvdet.invdate).toISOString();
    try {
      var navdetls = await helpers.getNAV(mfinvdet.scode, isodate)
      if (navdetls[0].nav.value !== "") {
        naverrflag = false;
        mfinvdet.nav = navdetls[0].nav.value;
        mfinvdet.units = mfinvdet.amount / mfinvdet.nav;
      } else {

        // No NAV found for the date and scheme code combination in database. Do not proceed with insert
        naverrflag = true;
        naverr.name = "NAV not found";
        naverr.message = "NAV not found";
        navoprn.transaction = mfinvdet.transaction;
        navoprn.invdate = isodate;
        navoprn.amount = mfinvdet.amount;
        navoprn.remarks = mfinvdet.remarks;
        navoprn.invFor = mfinvdet.invFor;
        navoprn.assetType = mfinvdet.assetType;
        navoprn.scode = mfinvdet.scode;
        navoprn.sname = mfinvdet.sname;
        var parseResult = helpers.parseOutput(naverrflag, naverr, navoprn);
      }
    } catch (err) {

      naverrflag = true;
      naverr.name = "NAV not found";
      naverr.message = "NAV not found";
      navoprn.transaction = mfinvdet.transaction;
      navoprn.invdate = isodate;
      navoprn.amount = mfinvdet.amount;
      navoprn.remarks = mfinvdet.remarks;
      navoprn.invFor = mfinvdet.invFor;
      navoprn.assetType = mfinvdet.assetType;
      navoprn.scode = mfinvdet.scode;
      navoprn.sname = mfinvdet.sname;
      var parseResult = helpers.parseOutput(naverrflag, naverr, navoprn);
    }
  }

  // Check if the NAV has been determined before proceeding with the inserted
  if (naverrflag === false) {
    try {
      let invdet
      var _id = new mongoose.Types.ObjectId();
      invdet = await mfinvModel.create({
        transaction: mfinvdet.transaction,
        amccode: mfinvdet.amccode,
        amcname: mfinvdet.amcname,
        scode: mfinvdet.scode,
        sname: mfinvdet.sname,
        invdate: mfinvdet.invdate,
        nav: mfinvdet.nav,
        units: mfinvdet.units,
        amount: mfinvdet.amount,
        remarks: mfinvdet.remarks,
        invFor: mfinvdet.invFor,
        assetType: mfinvdet.assetType,
        invBy: mfinvdet.invBy
      });
      var parseResult = helpers.parseOutput(errflag, invdet);

    } catch (err) {
      var operation = err.getOperation();
      var errflag = true;
      var parseResult = helpers.parseOutput(errflag, err, operation);

    }
  }
  return parseResult;
}

//This route posts a multiple Investments to database
async function postManyInvDet(mfinvdetls, user) {
  var resArray = [];
  await helpers.asyncForEach(mfinvdetls, async (item, index, array) => {
    try {

      result = await postOne(mfinvdetls[index], user);

      resArray.push(result);

    } catch (err) {

      resArray.push(err);

    }
  });

  return resArray;
}

/*
--------------------------------------------------------------------------------------------------------------------
* Get Aggregate Data Methods
--------------------------------------------------------------------------------------------------------------------
*/

async function getAggregation(aggr) {
  try {

    let aggrres;
    aggrres = await mfinvModel.aggregate([


      {
        $match: {
          invBy: {
            $eq: aggr.invBy
          }
        }
      },
      {
        $group: {
          _id: aggr.id,
          count: {
            $sum: 1
          },
          total: {
            $sum: aggr.totcol
          },
          schdet: {
            $push: "$$ROOT"
          }
        }
      }
      //
    ]);

    return aggrres;
  } catch (err) {

    return err;
  }
}

async function grpGoalAggregation(aggr) {
  try {

    let aggrres;
    aggrres = await mfinvModel.aggregate([


      {
        $match: {
          invBy: {
            $eq: aggr.invBy
          }
        }
      },
      {
        $group: {
          _id: {
            invFor: "$invFor",
            sname: "$sname",
            scode: "$scode"
          },
          invcount: {
            $sum: 1
          },
          totinv: {
            $sum: "$amount"
          },
          totalunits: {
            $sum: "$units"
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
      //
    ]);

    return aggrres;
  } catch (err) {

    return err;
  }
}

// Test for lookup schemename from scheme table
async function grpGoalAggregationUpd(aggr) {
  try {
    debugger;
    let aggrres;

    aggrres = await mfinvModel.aggregate([


      {
        $match: {
          invBy: {
            $eq: aggr.invBy
          }
        }
      },
      {
        $lookup: {
          from: "schemes",
          localField: "scode",
          foreignField: "scode",
          as: "schemesLU"
        }
      },
      {
        $group: {
          _id: {
            invFor: "$invFor",
            sname: "$schemesLU.sname",
            scode: "$scode"

          },
          invcount: {
            $sum: 1
          },
          totinv: {
            $sum: "$amount"
          },
          totalunits: {
            $sum: "$units"
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
      //
    ]);

    debugger;
    // Adding this section to return the current value data
    for (var i = 0; i < aggrres.length; i++) {
      aggrres[i].currval = await calchelpers.currval(aggrres[i]._id.scode, aggrres[i].totalunits);
      // aggrres[i].xirr = await calchelpers.xirrcalc(aggrres[i]._id.scode,aggr.invBy,aggrres[i]._id.invFor);
    }

    return aggrres;
  } catch (err) {

    return err;
  }
}


async function grpGoalSchemeAggregation(aggr) {
  try {
    debugger;
    let aggrres;
    aggrres = await mfinvModel.aggregate([


      {
        $match: {
          invBy: {
            $eq: aggr.invBy
          },
          invFor: {
            $eq: aggr.invFor
          }
        }
      },
      {
        $group: {
          _id: {
            invFor: aggr.invFor,
            sname: "$sname",
            scode: "$scode"
          },
          invcount: {
            $sum: 1
          },
          totinv: {
            $sum: "$amount"
          },
          totalunits: {
            $sum: "$units"
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
      //
    ]);

    return aggrres;
  } catch (err) {
    debugger;
    return err;
  }
}

/*
------------------------------------------------------------------------------------------------------------------------
* Delete Data Methods
------------------------------------------------------------------------------------------------------------------------
*/

async function deleteInv(_id) {
  try {
    debugger;
    let delres;
    delres = await mfinvModel.deleteOne({
      "_id": _id
    });
    return delres;
  } catch (err) {
    debugger;
    return err;
  }
}


/*
------------------------------------------------------------------------------------------------------------------------
* Module Exports
------------------------------------------------------------------------------------------------------------------------
*/

module.exports.findAll = findAll;
module.exports.postOne = postOne;
module.exports.getAggregation = getAggregation;
module.exports.grpGoalAggregation = grpGoalAggregation;
module.exports.grpGoalAggregationUpd = grpGoalAggregationUpd;
module.exports.grpGoalSchemeAggregation = grpGoalSchemeAggregation;
module.exports.findOneInvDet = findOneInvDet;
module.exports.findOneInvDetUpd = findOneInvDetUpd
module.exports.deleteInv = deleteInv;
module.exports.postManyInvDet = postManyInvDet;

module.exports.findAllTemp = findAllTemp;
