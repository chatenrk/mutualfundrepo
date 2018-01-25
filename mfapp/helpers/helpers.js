var parse = require('csv-parse');
var async = require('async');
const util = require('util');
const Promise = require('bluebird');
const passwordValidator = require('password-validator');
var fs = require("fs");
var es = require("event-stream");
var os = require("os");
const moment = require('moment');

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

	function parsetextNAV(file)
	{

		var lno;
		var contents = fs.readFileSync(file,"utf8").toString().split(os.EOL);
		var rarray=[],sarray = [];
		var robj = {};
		var isodate,date;
		for(var i=0;i<contents.length;i++)
		{
				if(i===0)
				{
						// Header line ignore it
				}
				else
				{
						sarray = contents[i].split(";")

						if(sarray.length>1)
						{

							robj.scode = sarray[0];
							robj.sname = sarray[1];
							robj.nav = sarray[2];
							
							// Convert date from DD-MMM-YYYY to ISO date
							date = moment(sarray[5],'DD-MMM-YYYY').format("YYYY-MM-DD")
							isodate = moment(date).toISOString();
							robj.date = isodate;
							rarray.push(robj);
							robj = {};
							isodate ='';
						}
						sarray ={};
				}
		}
		return rarray;


	}


module.exports.parseOutput = parseOutput;
module.exports.parsetextNAV = parsetextNAV;
module.exports.asyncForEach = asyncForEach;
module.exports.csvtojson = csvtojson;
module.exports.checkpwd = checkpwd;
