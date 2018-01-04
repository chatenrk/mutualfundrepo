var parse = require('csv-parse');
var async = require('async');
const util = require('util');
const Promise = require('bluebird');

function parseOutput(errflag,parseObject,operation)
{	
	debugger;
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
		parseResult.operation = parseObject;
	}
	
	return parseResult;
	
}


	async function csvtojson(file)
	{
	
		var mfschemes = [];
		
		var fs = Promise.promisifyAll(require("fs"));
		var Converter = require('csvtojson').Converter;
		Promise.promisifyAll(Converter.prototype);
		
		debugger;
		var converter = new Converter();
		mfschemes = await converter.fromStringAsync(fs.readFileSync(file.originalname, 'utf8'));
		
		return mfschemes;
		
	
	}
	

async function asyncForEach(array, callback) {
	  for (let index = 0; index < array.length; index++) 
	  { 
		  
		  try{
		 await callback(array[index], index, array)
		  }
		  catch(err){
			  
		  }
	  }
	}

module.exports.parseOutput = parseOutput;
module.exports.asyncForEach = asyncForEach;
module.exports.csvtojson = csvtojson;