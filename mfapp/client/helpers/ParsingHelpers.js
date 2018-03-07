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

        // Concatenate Assets, AssetQual, and Asset Currency
        pobj.passetfinal = pobj.passets + " " + pobj.assetqual + " " + pobj.assetcurr;

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
    }

  }
});
