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
    },

    _parsePostInvestment: function(data, that) {
      /**
       * @desc This is the helper method that parses the data that is returned from Post Investment
       *       Currently invoked
       * @param {array} data referring to the data that is inserted
       * @param {object} that referring to the this variable of the parent
       */

      if (data.opsuccess === false)

      {
        switch (data.errcode) {
          case 11000:
            // Error inserting data. Display the same in the message strip
            data.msg = "Data already exists for combination of " + data.operation.sname + " and " + data.operation.pdate + ". Please recheck"
            break;
          default:
            data.msg = "Error Occured. Please contact Admin"
        }
        that._generateMsgStrip(data.msg, true)
      } else {
        // Data inserted successfully
        var pdata = {};
        that._destroyMsgStrip(false);
        pdata = data.operation;
        pdata.pdate = DateHelpers._isodatetodate(pdata.invdate);
        return pdata;

      }
    }

  }
});
