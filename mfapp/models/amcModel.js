var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var integerValidator = require('mongoose-integer');

const helpers = require('../helpers/helpers.js');

var mfamcSchema = mongoose.Schema({

    amccode: Number,
    amcname: String
});



 
var mfamcModel = mongoose.model('amcs', mfamcSchema);


//This route gets all the documents inside the schemes collection in MongoDB
async function findAll()
{
try{
      let amcs 	    
      amcs = await mfamcModel.find();
    
      return amcs;
  } catch (err) 
  {
	
    return err;
  }
};


//This route finds AMC based on the Id sent
async function findOneAMC(id)
{
try{
      let amc 	    
      amc = await mfamcModel.find(id);
      return amc;
  } catch (err) 
  {
	
    return err;
  }
};


//This route posts a single AMC to database
async function postOne(mfamc)
{
	
	
	try
	{
		let amc 
		var _id = new mongoose.Types.ObjectId();	
		amc = await mfamcModel.create(
				{
					amccode:mfamc.amccode,
					amcname:mfamc.amcname
				});
				
		
		var parseResult = helpers.parseOutput(errflag,amc);
		
	} 
	catch (err) 
	{	
		
		var operation = err.getOperation();
		var errflag = true;
		var parseResult = helpers.parseOutput(errflag,err,operation);

	}	
	return parseResult;
}


//This route posts a multiple AMC's to database
async function postMany(amcs)
{
	
	var resArray= [];
	await helpers.asyncForEach(amcs,async (item,index,array) => 
    {
  	  try
  	  {	
  		  result = await postOne(amcs[index]);
  		  
  		  resArray.push(result);
  		  
  	  }
  	  catch(err)
  	  {
  		  	
  		  	resArray.push(err);

  	  }
    });
	
	return resArray;
}
    


module.exports.findAll = findAll; 
module.exports.postOne = postOne;
module.exports.postMany = postMany;
module.exports.findOneAMC = findOneAMC;
