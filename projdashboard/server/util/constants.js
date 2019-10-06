let navFileConstants = {
  navFileName: ['NavFile_', '.csv', '_', '/', 'downloads', 'NavFiles'],
  navFileHanaFields: ['scode', 'nav', 'date']
};
let dateFormats = {
  region: 'Asia/Kolkata',
  navFileDateFormat: 'YYYYMMDD'
};

let constants = {
  navFileConstants: navFileConstants,
  dateFormats: dateFormats
};
module.exports = Object.freeze(constants);
