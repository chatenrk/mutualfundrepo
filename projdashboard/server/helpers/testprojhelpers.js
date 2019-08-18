const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const integerValidator = require('mongoose-integer');


var SchemaTypes = mongoose.Schema.Types;

var testprojSchema = mongoose.Schema({
  scode: Number,
  pdate:String,
  pval: {
    type: Number,
    integer: true
  },
  tpurc: {
    type: Number,
    integer: true
  },
  nav: SchemaTypes.Double,
  units: SchemaTypes.Double,
  totunits: SchemaTypes.Double,
  totval: {
    type: Number,
    integer: true
  },
  gainloss:SchemaTypes.Double
});


var testprojModel = mongoose.model('projtests', testprojSchema);

async function findAll() {
  debugger
    try {
        let projdet;
        projdet = await testprojModel.find();
        return projdet;
    } catch (err) {
        return err;
    }
};

module.exports.findAll = findAll;