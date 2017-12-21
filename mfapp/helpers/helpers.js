function parseOutput(errflag,parseObject,operation)
{	
	
	var parseResult = {};
	
	// Error Parsing
	if(errflag === true)
	{
		parseResult.opsuccess = false;
		parseResult.errcode = parseObject.code; 
		parseResult.errtype = parseObject.name;
		parseResult.message = parseObject.message;
		parseResult.operation = operation;
	}
	// Success parsing
	else
	{
		parseResult.opsuccess = true;
		parseResult.object = parseObject;
	}
	
	return parseResult;
	
}

async function asyncForEach(array, callback) {
	  for (let index = 0; index < array.length; index++) 
	  { 
		  
		  try{
		 await callback(array[index], index, array)
		  }
		  catch(err){
			  debugger;
		  }
	  }
	}

module.exports.parseOutput = parseOutput;
module.exports.asyncForEach = asyncForEach;