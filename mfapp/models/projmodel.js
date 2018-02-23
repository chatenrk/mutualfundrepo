var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var integerValidator = require('mongoose-integer');

const helpers = require('../helpers/helpers.js');
const mfinvmodel = require('../models/mfinvmodel');
const navmodel = require('../models/navModel.js');

var projSchema = mongoose.Schema({

    scode: Number,
    sname:String,
    refscheme: Boolean,
    schtype: String
});


var projModel = mongoose.model('projections', projSchema);

//This route finds scheme projection details based on the Query sent
async function findAll(query)
{

try
  {
      let projdet;
      projdet = await projModel.find(query);
      return projdet;
  } catch (err)
  {
    return err;
  }
};


//This route posts a single projection to database
async function postOne(proj)
{

	try
	{
		let projres
		var _id = new mongoose.Types.ObjectId();
		projres = await projModel.create(
				{
          scode: proj.scode,
          sname:proj.sname,
          refscheme: proj.refscheme,
          schtype: proj.schtype
				});


		var parseResult = helpers.parseOutput(errflag,projres);

	}
	catch (err)
	{

		var operation = err.getOperation();
		var errflag = true;
		var parseResult = helpers.parseOutput(errflag,err,operation);

	}
	return parseResult;
}


//This route posts a multiple projections to database
async function postMany(projs)
{

	var resArray= [];
	await helpers.asyncForEach(projs,async (item,index,array) =>
    {
  	  try
  	  {
  		  result = await postOne(projs[index]);

  		  resArray.push(result);

  	  }
  	  catch(err)
  	  {

  		  	resArray.push(err);

  	  }
    });

	return resArray;
}

async function getrefSchemeInvDet(refscode,invBy)
{

  // Check if there is a scode available to get the all investment details
  if(refscode)
  {
    var query =
     {
       $and: [{scode:refscode},{invBy:invBy}]
     }

     try
       {
         invdet = await mfinvmodel.findOneInvDet(query);
         return invdet;
         // res.send(invdet);
       }
       catch(err)
       {
         //  return res.status(500).send(err);
       }
  }
  else
  {
      return res.status(200).send("No reference scheme found for query in database");
  }


}

async function returnprojval(projdet,invBy)
{
  var retobj = {},retarr=[];

  // Find the reference scheme from the lot
  var refscheme = helpers.findInArray(projdet,"refscheme",true);
  var refscode = refscheme.scode;
  var refschinvdet = await getrefSchemeInvDet(refscode,invBy);


  for(var i = 0;i<projdet.length;i++)
  {
    if(projdet[i].refscheme === true)
    {
      debugger;
      // Find last NAV in database for the scheme
			var lastNav = await navmodel.getLastNav(refscode);
			var lastnavval = parseFloat(lastNav[0].lastNavValue);

			//Find sum of investments
			var sinv = helpers.sumtotal(refschinvdet,"amount");
			// Find sum of units
			var sunits = helpers.sumtotal(refschinvdet,"units");

			// Total actual amount
			var invval = lastnavval * sunits;


			//Fill all of the details into return json
			retobj.refscheme = refscheme;
			retobj.lastNavDate = lastNav[0].lastNavDate;
			retobj.sinv = sinv;
			retobj.sunits = sunits;
			retobj.invval = invval;
    }
    else
    {
      // For all investments in refschinvdet, we need to find the corresponding NAV for the scode
      debugger;
      currscode = projdet[i].scode;
      var sinv = 0,sunits = 0.00;
      for(var j=0;j<refschinvdet.length;j++)
      {
        invdate = refschinvdet[j].invdate;
        amount = refschinvdet[j].amount;
        sinv = sinv+amount;
        // Get NAV for that date and scode
        var query = {
                      $and: [{scode:currscode},{date:invdate}]
        }
        var navdetls = await navmodel.findOneNav(query);
        var currnav = parseFloat(navdetls.nav);

        var units = amount/currnav;
        sunits = sunits+units;
      }
    }
  }
  retarr.push(retobj);
  return retarr;
}




module.exports.getrefSchemeInvDet = getrefSchemeInvDet;
module.exports.findAll = findAll;
module.exports.postOne = postOne;
module.exports.postMany = postMany;
module.exports.returnprojval = returnprojval;
