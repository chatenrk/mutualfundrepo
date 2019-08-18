const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const integerValidator = require('mongoose-integer');


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


/**
 * @desc This method gets the all investments based on the query
 * @param {JSON} query - query to pass to the investments collection
 * @return {JSON} invdet - Details of investments fetched based on query
 */
async function findInvDetls(query) {
  try {

      let invdet;
      invdet = await mfinvModel.find(query);
      return invdet;
  } catch (err) {
      return err;
  }
};

module.exports.findInvDetls = findInvDetls;