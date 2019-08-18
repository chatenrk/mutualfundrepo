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
    debugger;
    var navdetlsarraytemp = [],
        navdetlsarray = [];

    var lastInvDate,lastNavDate;
    var lastNavDetls;

    var projdbobj = {};
    var projdbarr = [];

    
    var refscode = parseInt(refscheme[0].scode);
    lastNavDetls = await navhelpers.getLastNav(refscode);

    // Get NAV's for reference scheme
    var navquery = {
        "scode": refscode
    }
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
            "scode": nonrefscode
        }
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
        
        // First fill the reference scheme details
        projsch.scode = refschinvdetls[i].scode;
        projsch.sname = refschinvdetls[i].sname;
        projsch.purchasedate = isodatetodate(refschinvdetls[i].invdate);
        projsch.purchasevalue = refschinvdetls[i].amount;
        projsch.nav = parseFloat(refschinvdetls[i].nav.value);
        projdbobj = popProjArray(projsch,navdetlsarray);
        projdbarr.push(projdbobj);
        projdbobj = {};

        // now do the same for all the non reference schemes one by one
        for (var j = 0; j < nonrefschemes.length; j++) {
            projsch.scode = nonrefschemes[j].scode;
            projsch.sname = nonrefschemes[j].sname;
            projsch.purchasedate = isodatetodate(refschinvdetls[i].invdate);
            projsch.purchasevalue = refschinvdetls[i].amount;
            projdbobj = popProjArray(projsch,navdetlsarray);
            projdbarr.push(projdbobj);
            projdbobj = {};
           
        }

        // Last Entry Check
        if (i === refschinvdetls.length - 1) {
            lastInvDate = isodatetodate(refschinvdetls[i].invdate);
            lastNavDate = isodatetodate(lastNavDetls[0].lastNavDate);

            // Now project for all entries in between this lastInvDate and lastNavDate
            while (lastInvDate <= lastNavDate) {
                
            }
        }

    }
    debugger;
   
    return(projdbarr);

}

function isodatetodate(isodate) {
    //Convert ISO Date into DD-MMM-YYYY format in IST Timezone
    var pdate = moment(isodate).utcOffset("+05:30").format('DD-MMM-YYYY');
    return pdate;
}

function datetoisodate(date) {
    // Convert date from DD-MMM-YYYY to ISO date
    var tempdate = moment(date, 'DD-MMM-YYYY').format("YYYY-MM-DD")
    var isodate = moment(tempdate).toISOString();
    return isodate
}

function findNAVNonRefScheme(scode, date, navdetlsarray) {

    for (var i = 0; i < navdetlsarray.length; i++) {
        if (scode === navdetlsarray[i].scode && date === isodatetodate(navdetlsarray[i].date)) {

            return navdetlsarray[i];
        }
    }
}

function flatten(array) {
    // reduce traverses the array and we return the result
    return array.reduce(function (acc, b) {
        // if is an array we use recursion to perform the same operations over the array we found 
        // else we just concat the element to the accumulator
        return acc.concat(Array.isArray(b) ? flatten(b) : b);
    }, []); // we initialize the accumulator on an empty array to collect all the elements
}

function popProjArray(projsch,navdetlsarray)
{
    var projdbobj;
    projdbobj.scode = projsch.scode;
    projdbobj.sname = projsch.sname;
    projdbobj.purchasedate = isodatetodate(projsch.invdate);
    projdbobj.purchasevalue = projsch.amount;
    if (projsch.nav) {
        projdbobj.nav = parseFloat(projsch.nav);
    } else {
        nonrefnav = findNAVNonRefScheme(projdbobj.scode, projdbobj.purchasedate, navdetlsarray);
        projdbobj.nav = parseFloat(nonrefnav.nav.value);
        nonrefnav = {};
    }
    projdbobj.units = projdbobj.purchasevalue / projdbobj.nav;
    return projdbobj;
}






module.exports.computeProjections = computeProjections;