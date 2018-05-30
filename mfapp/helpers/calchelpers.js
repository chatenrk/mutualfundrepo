const navmodel = require('../models/navModel');
const helpers = require('./helpers');


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

//  Calculate the current value of an investment by getting the last NAV and multiplyying by total units
async function currval(scode, totalUnits) {
  debugger;
  // get last NAV
  var lnav = await navmodel.getLastNav(parseInt(scode));
  var currvaldet = {};
  currvaldet.lastNav = parseFloat(lnav[0].lastNavValue);
  currvaldet.lastNavDate = helpers.isodatetodate(lnav[0].lastNavDate);
  currvaldet.currvalamnt = currvaldet.lastNav * parseFloat(totalUnits);
  return currvaldet;
}

function scientificToDecimal(num) {
  //if the number is in scientific notation remove it
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    var zero = '0',
      parts = String(num).toLowerCase().split('e'), //split into coeff and exponent
      e = parts.pop(), //store the exponential part
      l = Math.abs(e), //get the number of zeros
      sign = e / l,
      coeff_array = parts[0].split('.');
    if (sign === -1) {
      num = zero + '.' + new Array(l).join(zero) + coeff_array.join('');
    } else {
      var dec = coeff_array[1];
      if (dec) l = l - dec.length;
      num = coeff_array.join('') + new Array(l + 1).join(zero);
    }
  }

  return num;
};

module.exports.scientificToDecimal = scientificToDecimal;

module.exports.currval = currval;
