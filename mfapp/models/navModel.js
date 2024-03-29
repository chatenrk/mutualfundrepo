var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var integerValidator = require('mongoose-integer');

const helpers = require('../helpers/helpers.js');

var SchemaTypes = mongoose.Schema.Types;
var mfnavSchema = mongoose.Schema({

  scode: Number,
  sname: String,
  nav: SchemaTypes.Double,
  date: Date
});

var mfnavModel = mongoose.model('navdetls', mfnavSchema);



//This route gets all the documents inside the schemes collection in MongoDB
async function findAll() {
  try {
    let navdetls
    navdetls = await mfnavModel.find();

    return navdetls;
  } catch (err) {

    return err;
  }
};

// Find  NAV according to limit in the collection
async function findNNAV(id, limit, sort) {

  try {
    let navdetls
    if (sort === 'DSC') {

      navdetls = await mfnavModel.find(id).sort({
        date: -1
      }).limit(limit);

    } else if (sort === 'ASC') {
      navdetls = await mfnavModel.find(id).sort({
        date: 1
      }).limit(limit);
    }
    return navdetls;

  } catch (err) {

    return err;
  }



}

//This route gets the NAV based on query passed to it
async function findOneNav(id) {
  try {
    let navdetls
    navdetls = await mfnavModel.find(id);
    return navdetls;
  } catch (err) {

    return err;
  }
};


//This route posts a single scheme to database
async function postOne(mfnav) {


  try {
    let navdetls
    var _id = new mongoose.Types.ObjectId();
    navdetls = await mfnavModel.create({
      scode: mfnav.scode,
      sname: mfnav.sname,
      nav: mfnav.nav,
      date: mfnav.date
    });


    var parseResult = helpers.parseOutput(errflag, navdetls);

  } catch (err) {

    var operation = err.getOperation();
    var errflag = true;
    var parseResult = helpers.parseOutput(errflag, err, operation);

  }
  return parseResult;
}


//This route posts a multiple schemes to database
async function postMany(mfnavs) {

  var resArray = [];
  await helpers.asyncForEach(mfnavs, async (item, index, array) => {
    try {
      result = await postOne(mfnavs[index]);

      resArray.push(result);

    } catch (err) {

      resArray.push(err);

    }
  });

  return resArray;
}


// Get Last NAV details for a scheme
async function getLastNav(scode) {

  try {

    let aggrres;
    aggrres = await mfnavModel.aggregate([


      {
        $match: {
          scode: {
            $eq: scode
          }
        }
      },
      {
        $group: {
          _id: {
            sname: "$sname",
            scode: "$scode"
          },
          lastNavDate: {
            $last: "$date"
          },
          lastNavValue: {
            $last: "$nav"
          }
        }
      }

    ]);

    return aggrres;
  } catch (err) {

    return err;
  }
}


function postManyNew(mfnavs) {

  var db = mongoose.connection;
  var navdetls = db.collection("navdetlstemp");

  var bulkOp = navdetls.initializeUnorderedBulkOp(),
    counter = 0;
    succcounter = 0;

  var stats = {};  

  // Loop at the array of data, and insert in batches of 1000
  mfnavs.forEach(function (data) {
    bulkOp.insert(data);
    counter++;

    if (counter % 1000 == 0) {
      // Execute per 1000 operations and re-initialize every 1000 update statements
      bulkOp.execute(function (e, rresult) {
        succcounter = succcounter + rresult.nInserted;
      });
      bulkOp = navdetls.initializeUnorderedBulkOp();
    }

  });

  // Clean up queues
  if (counter % 1000 != 0) {
    bulkOp.execute(function (e, rresult) {
      succcounter = succcounter + rresult.nInserted;
    });
  }
  


  

}

module.exports.getLastNav = getLastNav;
module.exports.findAll = findAll;
module.exports.postOne = postOne;
module.exports.postMany = postMany;
module.exports.postManyNew = postManyNew;
module.exports.findOneNav = findOneNav;
module.exports.findNNAV = findNNAV;