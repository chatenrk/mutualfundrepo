/*
------------------------------------------------------------------------------------------------------------------------
* Declarations
------------------------------------------------------------------------------------------------------------------------
*/
var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var integerValidator = require('mongoose-integer');

const helpers = require('../helpers/helpers.js');

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
var mfinvModel = mongoose.model('mfinvdetltemp', mfinvSchema);

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
    debugger;
    if (desc = "") {
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

/*
------------------------------------------------------------------------------------------------------------------------
* Post Data Methods
------------------------------------------------------------------------------------------------------------------------
*/
//This route posts a single Inv Detail to database
async function postOne(mfinvdet, user) {


  // If user is not available use the one passed in the arguments
  if (!mfinvdet.invBy || mfinvdet.invBy === "") {
    mfinvdet.invBy = user;
  }


  // Check if the NAV is supplied, incase of multipost it is not supplied and has to be retrieved here
  if (!mfinvdet.nav || mfinvdet.nav === "") {

    var isodate = helpers.datetoisodate(mfinvdet.invdate);     //moment(mfinvdet.invdate).toISOString();
    try {
      var navdetls = await helpers.getNAV(mfinvdet.scode, isodate)
      if(navdetls[0].nav.value !== "")
      {
        mfinvdet.nav = navdetls[0].nav.value;
        mfinvdet.units = mfinvdet.amount / mfinvdet.nav;
      }
    } catch (err) {}
  }


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
------------------------------------------------------------------------------------------------------------------------
* Get Aggregate Data Methods
------------------------------------------------------------------------------------------------------------------------
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
          count: {
            $sum: 1
          },
          total: {
            $sum: "$amount"
          },

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
          count: {
            $sum: 1
          },
          total: {
            $sum: "$amount"
          },

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
module.exports.grpGoalSchemeAggregation = grpGoalSchemeAggregation;
module.exports.findOneInvDet = findOneInvDet;
module.exports.deleteInv = deleteInv;
module.exports.postManyInvDet = postManyInvDet;
