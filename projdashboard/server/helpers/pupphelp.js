const puppeteer = require('puppeteer');
const moment = require('moment');

const constants = require('../util/constants');

const amfiUrlArr = [
  'http://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=',
  '&tp=1&frmdt=',
  '&todt='
];

function createAMFIUrl(amccode, frmdt, todt) {
  return amfiUrlArr[0] + amccode + amfiUrlArr[1] + frmdt + amfiUrlArr[2] + todt;
}

function createNAVFilename(amccode, frmdt, todt) {
  return (
    constants.navFileConstants.navFileName[4] +
    constants.navFileConstants.navFileName[3] +
    constants.navFileConstants.navFileName[5] +
    constants.navFileConstants.navFileName[3] +
    constants.navFileConstants.navFileName[0] +
    amccode +
    constants.navFileConstants.navFileName[2] +
    moment(frmdt, 'DD-MMM-YYYY').format(
      constants.dateFormats.navFileDateFormat
    ) +
    constants.navFileConstants.navFileName[2] +
    moment(todt, 'DD-MMM-YYYY').format(
      constants.dateFormats.navFileDateFormat
    ) +
    constants.navFileConstants.navFileName[1]
  );
}

async function getNAVForAMC(amfiURL) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let newPage = await page.goto(amfiURL);

  const html = await page.evaluate(
    () => document.querySelector('pre').textContent
  );

  const opArray = html.split(/\r|\n/);
  await browser.close();
  return splitArray(opArray);
}

function splitArray(opArray) {
  let jsonObj = {},
    jsonArr = [];

  // First row is header, so we are not parsing it

  for (var i = 1; i < opArray.length; i++) {
    // Do not parse empty strings
    if (opArray[i].length !== 0) {
      opStringArray = opArray[i].split(';');
      // There are some rows which has only one entry, do not parse them
      if (opStringArray.length > 1) {
        for (var j = 0; j < opStringArray.length; j++) {
          switch (j) {
            case 0:
              //  Column 1 is Scheme code, needs to be converted into integer
              jsonObj['scode'] = parseInt(opStringArray[j]);
              break;
            case 1:
              // Column 2 is scheme code, pass it as it is
              jsonObj['sname'] = opStringArray[j];
              break;

            case 2:
              // Column 4 is not required
              break;

            case 3:
              // Column 5 is not required
              break;

            case 4:
              // Column 5 is NAV, needs conversion to double
              jsonObj['nav'] = parseFloat(opStringArray[j]);
              break;

            case 5:
              // Column 6 is not required
              break;

            case 6:
              // Column 7 is not required
              break;

            case 7:
              // Column 8 is NAV date
              jsonObj['date'] = opStringArray[j];
              break;

            default:
              break;
          }

          //   //   Do not parse empty strings
          //   if (opStringArray[j].length !== 0) {
          //     jsonObj[opArray[0].split(';')[j]] = opStringArray[j];
          //   }
        }
        jsonArr.push(jsonObj);
        jsonObj = {};
      }
    }
  }
  return jsonArr;
}

module.exports = {
  createAMFIUrl: createAMFIUrl,
  getNAVForAMC: getNAVForAMC,
  createNAVFilename: createNAVFilename
};
