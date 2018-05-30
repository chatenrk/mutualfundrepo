var parse = require('csv-parse');
var async = require('async');
const util = require('util');
const Promise = require('bluebird');
const passwordValidator = require('password-validator');
var fs = require("fs");
var es = require("event-stream");
var os = require("os");
const moment = require('moment');

const navmodel = require('../models/navModel');
const amcmodel = require('../models/amcmodel');
const schmodel = require('../models/schmodel');


function parseOutput(errflag, parseObject, operation) {

  var parseResult = {};

  // Error Parsing
  if (errflag === true) {
    parseResult.opsuccess = false;
    parseResult.errcode = parseObject.code;
    parseResult.errtype = parseObject.name;
    parseResult.message = parseObject.message;
    parseResult.operation = operation;
  }
  // Success parsing
  else {
    parseResult.opsuccess = true;
    parseResult.operation = parseObject;
  }

  return parseResult;

}


async function csvtojson(file) {

  var mfschemes = [];

  var fs = Promise.promisifyAll(require("fs"));
  var Converter = require('csvtojson').Converter;
  Promise.promisifyAll(Converter.prototype);


  var converter = new Converter();
  mfschemes = await converter.fromStringAsync(fs.readFileSync(file.originalname, 'utf8'));

  return mfschemes;


}


async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {

    try {
      await callback(array[index], index, array)
    } catch (err) {

    }
  }
}

function checkpwd(password) {
  // Create a schema
  var pwdschema = new passwordValidator();

  // Add properties to it
  pwdschema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

  if (pwdschema.validate(password) === true) {
    // Valid Password
    return "Pwd Suff";
  } else {
    return "insuff pwd";
  }
}

function parsetextNAV(file) {
  debugger;
  var lno;
  var contents = fs.readFileSync(file, "utf8").toString().split(os.EOL);
  var rarray = [],
    sarray = [];
  var robj = {};
  var isodate, date;
  for (var i = 0; i < contents.length; i++) {
    if (i === 0) {
      // Header line ignore it
    } else {
      sarray = contents[i].split(";")

      if (sarray.length > 1) {

        robj.scode = sarray[0];
        robj.sname = sarray[1];
        robj.nav = sarray[2];

        // Convert date from DD-MMM-YYYY to ISO date
        date = moment(sarray[5], 'DD-MMM-YYYY').format("YYYY-MM-DD")
        isodate = moment(date).toISOString();
        robj.date = isodate;
        rarray.push(robj);
        robj = {};
        isodate = '';
      }
      sarray = {};
    }
  }
  return rarray;


}

function parsetextINV(file) {
  debugger;
  var lno;
  var contents = fs.readFileSync(file, "utf8").toString().split(os.EOL);
  var rarray = [],
    sarray = [];
  var robj = {};
  var isodate, date;
  for (var i = 0; i < contents.length; i++) {
    if (i === 0) {
      // Header line ignore it
    } else {
      sarray = contents[i].split(";")

      if (sarray.length > 1) {

        robj.scode = sarray[0];
        robj.sname = sarray[1];
        robj.nav = sarray[2];

        // Convert date from DD-MMM-YYYY to ISO date
        date = moment(sarray[5], 'DD-MMM-YYYY').format("YYYY-MM-DD")
        isodate = moment(date).toISOString();
        robj.date = isodate;
        rarray.push(robj);
        robj = {};
        isodate = '';
      }
      sarray = {};
    }
  }
  return rarray;


}

function findInArray(array, key, value) {

  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
}

function sumtotal(array, key) {

  var stotal = 0.00,
    val = 0;
  for (var i = 0; i < array.length; i++) {

    if (array[i][key].value) {

      val = parseFloat(array[i][key].value);
    } else {
      val = array[i][key];
    }

    stotal = stotal + val;
  }
  return stotal;
}

function datetoisodate(date) {
  // Convert date from DD-MMM-YYYY to ISO date
  var tempdate = moment(date, 'DD-MMM-YYYY').format("YYYY-MM-DD")
  var isodate = moment(tempdate).toISOString();
  return isodate
}

function isodatetodate(isodate) {
  //Convert ISO Date into DD-MMM-YYYY format in IST Timezone
  var pdate = moment(isodate).utcOffset("+05:30").format('DD-MMM-YYYY');
  return pdate;
}

async function getNAV(scode, navdate) {
  /**
   * @desc This helper method is used to fetch the NAV values based on Scheme Code and Date of investment
   * @param scode{number} referring to scheme code
   * @param isodate{isodate} referring to Date of investment in ISO Date format
   * @return returns the NAV Value
   */


  var query = {
    $and: [{
      scode: scode
    }, {
      date: navdate
    }]
  }


  try {
    navdetls = await navmodel.findOneNav(query);
    return navdetls;
  } catch (err) {
    return err;
  }

}


async function getSchCode(sname) {
  /**
   * @desc This helper method is used to fetch the scheme code based on scheme name
   * @param sname{String} referring to scheme name
   * @return returns the scheme code
   */

  var id = {
    sname: sname
  }

  try {
    schemes = await schmodel.findOneSchDet(id);
    return schemes;
  } catch (err) {

    return err;
  }

}

async function getAMCName(amccode) {
  /**
   * @desc This helper method is used to fetch the AMC Name based on amc code
   * @param amccode{Numbers} referring to amc code
   * @return returns the AMC Name
   */

  var id = {
    amccode: amccode
  }

  try {
    amc = await amcmodel.findOneAMC(id);
    return amc;
  } catch (err) {
    return err;
  }
}


module.exports.parseOutput = parseOutput;
module.exports.parsetextNAV = parsetextNAV;
module.exports.parsetextINV = parsetextINV;
module.exports.asyncForEach = asyncForEach;
module.exports.csvtojson = csvtojson;
module.exports.checkpwd = checkpwd;
module.exports.findInArray = findInArray;
module.exports.sumtotal = sumtotal;
module.exports.datetoisodate = datetoisodate;
module.exports.isodatetodate = isodatetodate;
module.exports.getNAV = getNAV;
module.exports.getSchCode = getSchCode;
module.exports.getAMCName = getAMCName;
