var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var integerValidator = require('mongoose-integer');

const helpers = require('../helpers/helpers.js');

var mfschemeSchema = mongoose.Schema({

    scode: Number,
    sname: String
});

var SchemaTypes = mongoose.Schema.Types;

var mfschdetSchema = mongoose.Schema({

    scode: Number,
    sname: String,
    category:String,
    assets: {
        type: Number,
        integer: true
    },
   
    assetdate:String,
    assetcurr:String,
    assetqual:String,
    expense: SchemaTypes.Double,
    expensedate:String,
    fhouse: String,
    ldate: String,
    bmark: String,
    risk: String,
    return: String,
    rlaunch: SchemaTypes.Double,
    mininv:{
        type: Number,
        integer: true
    },
    minaddinv: {
        type: Number,
        integer: true
    },
    minwith: {
        type: Number,
        integer: true
    },
    minswpwith:{
        type: Number,
        integer: true
    },
    minbal:{
        type: Number,
        integer: true
    },
    exitload:String,
    ptype:String,
    schtype:String,
    imgpath:String,
    schurl:String
});

mfschdetSchema.plugin(integerValidator);
 
var mfschemesModel = mongoose.model('schemes', mfschemeSchema);
var mfschdetModel = mongoose.model('schdetail', mfschdetSchema);

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


//This route gets all the documents inside the schemes collection in MongoDB
async function findOneSchDet(id)
{
try{
      let schemes 	    
      schemes = await mfschdetModel.find(id);
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
		
		var operation = err.getOperation();
		var errflag = true;
		var parseResult = helpers.parseOutput(errflag,err,operation);

	}	
	return parseResult;
}


//This route posts a single scheme details to database
async function postOneSchDet(mfschdet)
{
	
	debugger;
	try
	{
		let schDet 
		var _id = new mongoose.Types.ObjectId();	
		schDet = await mfschdetModel.create(
				{
					scode:mfschdet.scode,
					sname:mfschdet.sname,
					category:mfschdet.category,
				    assets:mfschdet.assets,
				    assetdate:mfschdet.assetdate,
				    assetcurr:mfschdet.assetcurr,
				    assetqual:mfschdet.assetqual,
				    expense:mfschdet.expense,
				    expensedate:mfschdet.expensedate,
				    fhouse:mfschdet.fhouse,
				    ldate:mfschdet.ldate,
				    bmark:mfschdet.bmark,
				    risk:mfschdet.risk,
				    return:mfschdet.return,
				    rlaunch:mfschdet.rlaunch,
				    mininv:mfschdet.mininv,
				    minaddinv:mfschdet.minaddinv,
				    minwith:mfschdet.minwith,
				    minswpwith:mfschdet.minswpwith,
				    minbal:mfschdet.minbal,
				    exitload:mfschdet.exitload,
				    ptype:mfschdet.ptype,
				    schtype:mfschdet.schtype,
				    imgpath:mfschdet.imgpath,
				    schurl:mfschdet.schurl
				});
				
		var parseResult = helpers.parseOutput(errflag,schDet);
		
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
	var resArray= [];
	await helpers.asyncForEach(mfschemes,async (item,index,array) => 
    {
  	  try
  	  {	
  		  result = await postOne(mfschemes[index]);
  		  
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
module.exports.postOneSchDet = postOneSchDet;
module.exports.findOneSchDet = findOneSchDet;
