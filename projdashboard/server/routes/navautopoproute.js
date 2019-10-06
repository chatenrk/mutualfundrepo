const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const fs = require('fs');

const pupphelp = require('../helpers/pupphelp');
const constants = require('../util/constants');

/**
 * @description This function auto retrieves the data from AMFI website
 */
router.get('/getnavauto', async (req, res, next) => {
  // Get all AMC's from database

  const amfiURL = pupphelp.createAMFIUrl('3', '01-Sep-2019', '06-Oct-2019');

  try {
    const amfiFile = pupphelp.createNAVFilename(
      '3',
      '01-Sep-2019',
      '06-Oct-2019'
    );
    let navArr = await pupphelp.getNAVForAMC(amfiURL);
    const fields = constants.navFileConstants.navFileHanaFields;
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(navArr);
    fs.writeFile(amfiFile, csv, 'utf8', function(err) {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.send('File created');
      }
    });
    // res.send(amfiFile);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
