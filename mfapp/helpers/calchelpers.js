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

module.exports.currval = currval;
