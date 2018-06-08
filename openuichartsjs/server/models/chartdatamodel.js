var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var integerValidator = require('mongoose-integer');


var SchemaTypes = mongoose.Schema.Types;

var navLineSchema = mongoose.Schema({

  date: String,
  nav: SchemaTypes.Double,
});

var mulLineSchema = mongoose.Schema({

  date: String,
  scode: Number,
  nav: SchemaTypes.Double,
  sname: String,
  prcamnt: {
    type: Number,
    integer: true
  },
  totamnt: {
    type: Number,
    integer: true
  },
  untsprc: SchemaTypes.Double,
  totunts: SchemaTypes.Double,
  value: SchemaTypes.Double
});

var legendSchema = mongoose.Schema({
  stype: String,
  scode: Number,
  sname: String

});

var navLineModel = mongoose.model('navlinedetls', navLineSchema);
var mulLineModel = mongoose.model('mullinecmpdetls', mulLineSchema);
var legendModel = mongoose.model('legenddetls', legendSchema);

//This route gets all the documents
async function findAll() {
  try {

    let navdetls
    navdetls = await navLineModel.find();

    return navdetls;
  } catch (err) {

    return err;
  }
};


//This route gets all the documents
async function findAllMulLineData(scode) {
  try {
    debugger;
    let aggrres

// If scheme code is supplied then get all investment data for that scheme, else get data for all schemes
    if (scode && scode != "") {
      var scodetemp = parseInt(scode);
      aggrres = await mulLineModel.aggregate([

        {
          $match: {
            scode: {
              $eq: scodetemp
            }
          }
        },
        {
          $group: {
            _id: {
              sname: "$sname",
              scode: "$scode"
            },
            navdetls: {
              $push: "$$ROOT"
            }
          },

        }
        //
      ]);
    } else {

      aggrres = await mulLineModel.aggregate([

        {
          $group: {
            _id: {
              sname: "$sname",
              scode: "$scode"
            },
            navdetls: {
              $push: "$$ROOT"
            }
          },

        }
        //
      ]);
    }

    return aggrres;
  } catch (err) {

    return err;
  }
};


//This route gets all the documents
async function getLegendData() {
  try {

    let aggrres

    aggrres = await legendModel.aggregate([

      {
        $group: {
          _id: {
            stype: "$stype"
          },
          legdetls: {
            $push: "$$ROOT"
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
};


module.exports.findAll = findAll;
module.exports.findAllMulLineData = findAllMulLineData;
module.exports.getLegendData = getLegendData;
