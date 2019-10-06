const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const SchemaTypes = mongoose.Schema.Types;

// Schema declaration
const mfnavSchema = mongoose.Schema({
  scode: Number,
  sname: String,
  nav: SchemaTypes.Double,
  date: Date
});

// Model Declaration
const mfnavModel = mongoose.model('navdetls', mfnavSchema);

/**
 * @desc This method gets the last NAV for the scheme code that is passed
 * @param {Number} scode - Scheme code
 * @return {JSON} aggrres - Aggregate result of the last scheme NAV
 */
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
            sname: '$sname',
            scode: '$scode'
          },
          lastNavDate: {
            $last: '$date'
          },
          lastNavValue: {
            $last: '$nav'
          }
        }
      }
    ]);

    return aggrres;
  } catch (err) {
    return err;
  }
}

/**
 * @desc This method gets the specified number of NAV for the scheme code that is passed
 * @param {JSON} id - JSON array for the search parameters
 * @param {number} limit - Number of documents to be fetched
 * @return {JSON} navdetls - NAV Details requested
 */
// Find  NAV according to limit in the collection
async function findNNAV(id, limit) {
  try {
    let navdetls;
    if (!limit) {
      navdetls = await mfnavModel.find(id);
    } else {
      navdetls = await mfnavModel.find(id).limit(limit);
    }
    return navdetls;
  } catch (err) {
    return err;
  }
}

//This route gets the NAV based on query passed to it
async function findOneNav(id) {
  try {
    let navdetls;
    navdetls = await mfnavModel.find(id);
    return navdetls;
  } catch (err) {
    return err;
  }
}

// Module Exports
module.exports = {
  getLastNav: getLastNav,
  findNNAV: findNNAV,
  findOneNav: findOneNav
};
