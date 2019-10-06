const express = require('express');
const router = express.Router();

const navhelpers = require('../helpers/navhelpers');
const projhelpers = require('../helpers/projhelpers');
const invhelpers = require('../helpers/invhelpers');
const calchelpers = require('../helpers/calchelpers');
const testprojhelpers = require('../helpers/testprojhelpers');

router.get('/dateCheck', async (req, res, next) => {
  const date = {};
  date.EOM = calchelpers.endOfMonth(req.query.date);
  date.nextDate = calchelpers.nextDate(req.query.date);
  date.nextMonthFirstDate = calchelpers.nextDate(date.EOM);
  res.send(date);
});

router.get('/projinfo', async (req, res, next) => {
  // First get the relevant schemes based on the scheme category passed
  try {
    var schcat = req.query.schcat;
    if (schcat && schcat != '') {
      // Get the Reference scheme details
      var refscheme = await projhelpers.findRefScheme(schcat, 'TRUE');
      if (refscheme.length > 1) {
        // More than one reference schemes, report the error
      } else if (refscheme.length === 0) {
        // No reference scheme found
      } else {
        // Get all investments for the reference scheme
        var refschquery = {
          scode: refscheme[0].scode,
          invBy: 'Chaitanya Rayabharam'
        };
        var refschinvdetls = await invhelpers.findInvDetls(refschquery);
        if (refschinvdetls.length > 0) {
          //  Get all non reference schemes for computations
          var nonrefschemes = await projhelpers.findRefScheme(schcat, 'FALSE');
          var projdetls = await calchelpers.computeProjections(
            refscheme,
            nonrefschemes,
            refschinvdetls
          );
          if (projdetls.length > 0) {
            res.send(projdetls);
          } else {
            return res
              .status(200)
              .send('Issue computing projection details. Please contact admin');
          }
        } else {
          return res
            .status(200)
            .send('No data found for reference scheme. Please contact admin');
        }
      }
    } else {
      return res
        .status(200)
        .send('Please pass mandatory field scheme category');
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/testprojinfo', async (req, res, next) => {
  try {
    debugger;
    var schcat = await testprojhelpers.findAll();

    if (schcat.length > 0) {
      res.send(schcat);
    } else {
      return res.status(200).send('No data found for query');
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

// TODO: Check and clean this dead code
// // Get all schemes that are relevant for the selected scheme category(Multicap,midcap etc)
// router.get('/schcat', async (req, res, next) => {
//   try {

//     var schcat = await projmodel.findAll();

//     if (schcat.length > 0) {
//       res.send(schcat);
//     } else {
//       return res.status(200).send("No data found for query");
//     }

//   } catch (err) {

//     return res.status(500).send(err);
//   }

// });

// // Get last NAV for a scheme
// router.get('/schLastNAV', async (req, res, next) => {
//   try {

//     const scode = parseInt(req.query.scode);

//     const lastNav = await navhelpers.getLastNav(scode);

//     if (lastNav.length > 0) {
//       res.send(lastNav);
//     } else {
//       return res.status(200).send("No data found for query");
//     }

//   } catch (err) {

//     return res.status(500).send(err);
//   }

// });

// // Get last NAV for a scheme
// router.get('/schNNAV', async (req, res, next) => {

//   try {
//     var scode = parseInt(req.query.scode);
//     var limit = parseInt(req.query.limit);

//     var query = {
//       "scode":scode
//     };

//     if (!limit) {
//       lastNav = await navhelpers.findNNAV(query);
//     } else {
//       lastNav = await navhelpers.findNNAV(query, limit);
//     }

//     if (lastNav.length > 0) {
//       res.send(lastNav);
//     } else {
//       return res.status(200).send("No data found for query");
//     }

//   } catch (err) {

//     return res.status(500).send(err);
//   }

// });

// // Find Reference Scheme
// router.get('/findRefScheme', async (req, res, next) => {
//   try {
//     debugger;
//     var schcat = req.query.schcat;
//     var isRefFund = req.query.isRefFund;

//     if(schcat && schcat!= ""){

//       const refscheme = await projhelpers.findRefScheme(schcat,isRefFund);

//       if (refscheme.length > 0) {
//         res.send(refscheme);
//       } else {
//         return res.status(200).send("No data found for query");
//       }
//     }

//   } catch (err) {

//     return res.status(500).send(err);
//   }

// });

module.exports = router;
