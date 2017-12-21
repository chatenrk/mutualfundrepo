var mongoose = require('mongoose');

const helpers = require('../helpers/helpers.js');

var mfschemeSchema = mongoose.Schema({

    scode: Number,
    sname: String
});
 
var mfschemesModel = mongoose.model('schemes', mfschemeSchema);

//This route gets all the documents inside the schemes collection in MongoDB
async function findAll()
{
try{
      let schemes 	    
      schemes = await mfschemesModel.find();
    
      return schemes;
  } catch (err) 
  {
	
    return err;
  }
};


//This route posts a single scheme to database
async function postOne(mfscheme)
{
	
	
	try
	{
		let schemes 
		var _id = new mongoose.Types.ObjectId();	
		schemes = await mfschemesModel.create({scode:mfscheme.scode,sname:mfscheme.sname});
		var parseResult = helpers.parseOutput(errflag,schemes);
		
	} 
	catch (err) 
	{	
		debugger;
		var operation = err.getOperation();
		var errflag = true;
		var parseResult = helpers.parseOutput(errflag,err,operation);

	}	
	return parseResult;
}

//This route posts a multiple schemes to database
async function postMany(mfschemes)
{
	debugger
	var resArray= [];
	
	
// This is temp code for insertion, needs to be updated 	
//	var mfschemes = 
//	  [{
//			"scode": "103456",
//			"sname": "Axis Banking & PSU Debt Fund - Bonus Option"
//		},
//		{
//			"scode": "100427",
//			"sname": "Axis Banking & PSU Debt Fund - Daily Dividend Option"
//		}
//	]

	
	await helpers.asyncForEach(mfschemes,async (item,index,array) => 
    {
  	  try
  	  {	
  		  result = await postOne(mfschemes[index]);
  		  debugger;
  		  resArray.push(result);
  		  
  	  }
  	  catch(err)
  	  {
  		  	debugger;
  		  	resArray.push(err);

  	  }
    });
	debugger;
	return resArray;
}
    


module.exports.findAll = findAll; 
module.exports.postOne = postOne;
module.exports.postMany = postMany;
