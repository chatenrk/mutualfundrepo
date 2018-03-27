sap.ui.define(["./DateHelpers", "./OtherHelpers"], function(DateHelpers, OtherHelpers) {
  "use strict";

  return {
    _parseSchDetails: function(data) {

      var pobj = {},
        parr = [];

      for (var i = 0; i < data.length; i++) {
        pobj = data[i];

        // Parse all the dates using the date helper class
        // Asset date
        pobj.passetdate = DateHelpers._isodatetodate(pobj.assetdate);

        // Expense date
        pobj.pexpensedate = DateHelpers._isodatetodate(pobj.expensedate);

        // Launch date
        pobj.pldate = DateHelpers._isodatetodate(pobj.ldate);

        //Parse the Asset data
        pobj.passets = OtherHelpers._formatCurrency(pobj.assets);

        // Concatenate Assets, AssetQual
        pobj.passetfinal = pobj.passets + " " + pobj.assetqual;

        parr.push(pobj);
        pobj = {};
      }
      return parr;
    },
    _parseInvDetails: function(data) {

      var pobj = {},
        parr = [];

      for (var i = 0; i < data.length; i++) {
        pobj = data[i];
        pobj.invdatefmtd = DateHelpers._isodatetodate(pobj.invdate);

        parr.push(pobj);
        pobj = {};
      }
      return parr;
    },

    _parseInvSchemeAggrData: function(data) {
      var pobj = {},
        parr = [];
      for (var i = 0; i < data.length; i++) {
        // Check if the total is grater than zero, we are not displaying zero investments for the user
        if (data[i].totinv > 0) {
          pobj.scode = data[i]._id.scode;
          pobj.sname = data[i]._id.sname;
          pobj.invFor = data[i]._id.invFor;
          pobj.invcount = data[i].invcount;
          pobj.totalunits = data[i].totalunits;
          pobj.totinv = data[i].totinv;
          parr.push(pobj);
          pobj = {};
        }
      }
      return parr;
    }

  }
});
