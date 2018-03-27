const navmodel = require('../models/navModel');

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

async function currval(scode){
  // get last NAV
var lnav = await navmodel.getLastNav(scode);
  // get total units
}
