const moment = require('moment');
const navhelpers = require('./navhelpers');

/**
 * @desc This method computes the projection dashboard data using the reference and non reference refscheme
 *       details provided to it
 * @param {array} refscheme - Array having reference scheme detail
 * @param {array} nonrefschemes - Array having non reference scheme details
 * @param {array} refschinvdetls - Array having reference scheme investments performed
 * @return {array} projdetails - Final projection details computed
 */
async function computeProjections(refscheme, nonrefschemes, refschinvdetls) {
  var navdetlsarraytemp = [],
    navdetlsarray = [];

  var lastInvDate, lastNavDate;
  var lastNavDetls;

  var projdbobj = {};
  var projdbarr = [];

  let projsch = {},
    nonrefnav = {};

  var refscode = parseInt(refscheme[0].scode);
  lastNavDetls = await navhelpers.getLastNav(refscode);

  // Get NAV's for reference scheme
  var navquery = {
    scode: refscode
  };
  var navdetls = await navhelpers.findNNAV(navquery);
  if (navdetls.length > 0) {
    navdetlsarraytemp.push(navdetls);
  }
  navdetls = [];

  // First get all NAV's for non-reference schemes
  for (var i = 0; i < nonrefschemes.length; i++) {
    // Get all NAV's for the scheme
    var nonrefscode = parseInt(nonrefschemes[i].scode);
    var navquery = {
      scode: nonrefscode
    };
    var navdetls = await navhelpers.findNNAV(navquery);
    if (navdetls.length > 0) {
      navdetlsarraytemp.push(navdetls);
    }
    navdetls = [];
  }

  // Flatten the NAV details Array, as it is an array of arrays
  navdetlsarray = flatten(navdetlsarraytemp);

  // Now form the projection dashboard array
  for (var i = 0; i < refschinvdetls.length; i++) {
    // todo clean this code up into a function for better readability and maintainence
    // First fill the reference scheme details
    projsch.scode = refschinvdetls[i].scode;
    projsch.sname = refschinvdetls[i].sname;
    projsch.purchasedate = isodatetodate(refschinvdetls[i].invdate);
    projsch.purchasevalue = refschinvdetls[i].amount;
    projsch.nav = parseFloat(refschinvdetls[i].nav.value);
    // todo clean this code up
    // projdbobj = popProjArray(projsch);
    projdbarr.push(projsch);
    projdbobj = {};

    // now do the same for all the non reference schemes one by one
    for (var j = 0; j < nonrefschemes.length; j++) {
      projsch.scode = nonrefschemes[j].scode;
      projsch.sname = nonrefschemes[j].sname;
      projsch.purchasedate = isodatetodate(refschinvdetls[i].invdate);
      projsch.purchasevalue = refschinvdetls[i].amount;

      //   TODO Clean this code as the ES6 Find function is faster

      //   //   Populate the NAV
      //   nonrefnav = findNAVNonRefScheme(
      //     projsch.scode,
      //     projsch.purchasedate,
      //     navdetlsarray
      //   );

      // TODO: Check if ES6 find is working better than Loop and find.. for performance reasons
      nonrefnav = findNAVNonRefSchemeUpd(
        projsch.scode,
        projsch.purchasedate,
        navdetlsarray
      );

      projsch.nav = parseFloat(nonrefnav.nav.value);
      nonrefnav = {};

      // todo clean this code up
      //   projdbobj = popProjArray(projsch);
      projdbarr.push(projsch);
      projdbobj = {};
    }

    // todo Complete the logic for computing entries between
    // todo last Investment date and Last recorded NAV Date
    // Last Entry Check
    if (i === refschinvdetls.length - 1) {
    }
  }

  return projdbarr;
}
/**
 * @description This function converts ISO Date into DD-MMM-YYYY format in IST Timezone
 * @param {*} isodate
 * @returns {*} pdate ISO Date in DD-MMM-YYYY format in IST Timezone
 */
function isodatetodate(isodate) {
  let pdate = moment(isodate)
    .utcOffset('+05:30')
    .format('DD-MMM-YYYY');

  return pdate;
}

function datetoisodate(date) {
  // Convert date from DD-MMM-YYYY to ISO date
  var tempdate = moment(date, 'DD-MMM-YYYY').format('YYYY-MM-DD');
  var isodate = moment(tempdate).toISOString();
  return isodate;
}

//   TODO Clean this code as the ES6 Find function is faster
// function findNAVNonRefScheme(scode, date, navdetlsarray) {
//   for (var i = 0; i < navdetlsarray.length; i++) {
//     if (
//       scode === navdetlsarray[i].scode &&
//       date === isodatetodate(navdetlsarray[i].date)
//     ) {
//       return navdetlsarray[i];
//     }
//   }
// }

function findNAVNonRefSchemeUpd(scode, date, navdetlsarray) {
  return navdetlsarray.find(
    x => scode === x.scode && date === isodatetodate(x.date)
  );
}

function flatten(array) {
  // reduce traverses the array and we return the result
  return array.reduce(function(acc, b) {
    // if is an array we use recursion to perform the same operations over the array we found
    // else we just concat the element to the accumulator
    return acc.concat(Array.isArray(b) ? flatten(b) : b);
  }, []); // we initialize the accumulator on an empty array to collect all the elements
}

function popProjArray(projsch) {
  var projdbobj = {};
  projdbobj.scode = projsch.scode;
  projdbobj.sname = projsch.sname;
  projdbobj.purchasedate = projsch.purchasedate;
  projdbobj.purchasevalue = projsch.purchasevalue;
  projdbobj.nav = parseFloat(projsch.nav);
  projdbobj.units = projdbobj.purchasevalue / projdbobj.nav;
  return projdbobj;
}

/**
 * @desc This method computes the delta entries between Last Investment Date and
 *       last NAV Date
 */
function computeEntriesBtwnLNDAndLID() {
  // TODO Complete this function and invoke the same in compute projections
  // lastInvDate = isodatetodate(refschinvdetls[i].invdate);
  //       lastNavDate = isodatetodate(lastNavDetls[0].lastNavDate);
  //       // Now project for all entries in between this lastInvDate and lastNavDate
  //       while (lastInvDate <= lastNavDate) {}
}

module.exports.computeProjections = computeProjections;
