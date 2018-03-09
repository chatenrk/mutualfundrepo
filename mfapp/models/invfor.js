var mongoose = require('mongoose');


const helpers = require('../helpers/helpers.js');


var SchemaTypes = mongoose.Schema.Types;
var mfinvForSchema = mongoose.Schema({
    inv_for:String,
    key: String,
    text: String,

});


var mfinvForModel = mongoose.model('InvGoals', mfinvForSchema);


//This route gets all the documents inside the schemes collection in MongoDB
async function findAll()
{
try{
      let invdet
      invdet = await mfinvForModel.find();

      return invdet;
  } catch (err)
  {

    return err;
  }
};


//This route finds Investment Details based on the Query sent
async function findOneGoal(query)
{

try
  {
      let invdet;
      invdet = await mfinvForModel.find(query);
      return invdet;
  } catch (err)
  {
    return err;
  }
};


//This route posts a single Inv Detail to database
async function postOne(mfinvfor)
{


	try
	{
		let invdet
		var _id = new mongoose.Types.ObjectId();
		invdet = await mfinvForModel.create(
				{
          inv_for:mfinvfor.inv_for,
          key: mfinvfor.key,
          text: mfinvfor.text

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




module.exports.findAll = findAll;
module.exports.postOne = postOne;
module.exports.findOneGoal = findOneGoal;
