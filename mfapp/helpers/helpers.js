var parse = require('csv-parse');
var async = require('async');
const util = require('util');
const Promise = require('bluebird');
const passwordValidator = require('password-validator');

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

function checkpwd(password)
{
	// Create a schema 
	var pwdschema = new passwordValidator();
	
	// Add properties to it 
	pwdschema
	.is().min(8)                                    // Minimum length 8 
	.is().max(100)                                  // Maximum length 100 
	.has().uppercase()                              // Must have uppercase letters 
	.has().lowercase()                              // Must have lowercase letters 
	.has().digits()                                 // Must have digits 
	.has().not().spaces()                           // Should not have spaces 
	.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values 
	
	if(pwdschema.validate(password) === true) 
	{
		// Valid Password
		return "Pwd Suff";
	}
	else
	{
		return "insuff pwd";
	}	
}

module.exports.parseOutput = parseOutput;
module.exports.asyncForEach = asyncForEach;
module.exports.csvtojson = csvtojson;
module.exports.checkpwd = checkpwd;