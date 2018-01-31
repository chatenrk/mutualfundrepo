var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var integerValidator = require('mongoose-integer');

const helpers = require('../helpers/helpers.js');


var SchemaTypes = mongoose.Schema.Types;
var mfinvSchema = mongoose.Schema({
    transaction:String,
    amccode: Number,
    amcname: String,
    scode: Number,
    sname: String,
    invdate:Date,
    nav:SchemaTypes.Double,
    units:SchemaTypes.Double,
    amount: {
        type: Number,
        integer: true
    },
    remarks:String,
    invFor:String,
    assetType:String,
    invBy:String
});

mfinvSchema.plugin(integerValidator);




var mfinvModel = mongoose.model('mfinvdetl', mfinvSchema);


//This route gets all the documents inside the schemes collection in MongoDB
async function findAll()
{
try{
      let invdet
      invdet = await mfinvModel.find();

      return invdet;
  } catch (err)
  {

    return err;
  }
};


//This route finds Investment Details based on the Query sent
async function findOneInvDet(query)
{
try{
      let invdet;
      invdet = await mfinvModel.find(query);
      return invdet;
  } catch (err)
  {

    return err;
  }
};


//This route posts a single Inv Detail to database
async function postOne(mfinvdet)
{


	try
	{
		let invdet
		var _id = new mongoose.Types.ObjectId();
		invdet = await mfinvModel.create(
				{
          transaction:mfinvdet.transaction,
          amccode:mfinvdet.amccode,
					amcname:mfinvdet.amcname,
					scode:mfinvdet.scode,
					sname:mfinvdet.sname,
					invdate:mfinvdet.invdate,
					nav:mfinvdet.nav,
					units:mfinvdet.units,
					amount:mfinvdet.amount,
					remarks:mfinvdet.remarks,
					invFor:mfinvdet.invFor,
					assetType:mfinvdet.assetType,
					invBy:mfinvdet.invBy
				});


		var parseResult = helpers.parseOutput(errflag,invdet);

	}
	catch (err)
	{

		var operation = err.getOperation();
		var errflag = true;
		var parseResult = helpers.parseOutput(errflag,err,operation);

	}
	return parseResult;
}

async function getAggregation(aggr)
{
  try
  {

    let aggrres;
    aggrres = await mfinvModel.aggregate([


              { $match: {invBy: {$eq: aggr.invBy}} },
              {
                $group: {
                        _id: aggr.id,
                        count: {$sum: 1},
                        total:{$sum:aggr.totcol},
                        schdet: { $push: "$$ROOT" }
                      }
              }
    //
        ]);

    return aggrres;
  }
  catch (err)
  {

    return err;
  }
}



module.exports.findAll = findAll;
module.exports.postOne = postOne;
module.exports.getAggregation = getAggregation;
//module.exports.postMany = postMany;
module.exports.findOneInvDet = findOneInvDet;
