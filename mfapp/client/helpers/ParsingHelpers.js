sap.ui.define(["./DateHelpers", "./OtherHelpers", "./GatewayHelper"], function(
  DateHelpers,
  OtherHelpers,
  GatewayHelper
) {
  "use strict";

  return {
    _parseSchDetails: function(data) {
      var pobj = {},
        parr = [];

      for (var i = 0; i < data.length; i++) {
        pobj = data[i];

        // Retrieve scheme name from the lookup instead of the table
        pobj.sname = data[i].schemesLU[0].sname;

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
        pobj.sname = data[i].schemesLU[0].sname;
        parr.push(pobj);
        pobj = {};
      }
      return parr;
    },

    _parseInvSchemeAggrData: function(data) {
      var pobj = {},
        parr = [];

      var that = this;
      for (var i = 0; i < data.length; i++) {
        // Check if the total is grater than zero, we are not displaying zero investments for the user
        if (data[i].totinv > 0) {
          pobj.scode = data[i]._id.scode;
          pobj.sname = data[i]._id.sname[0];
          pobj.invFor = data[i]._id.invFor;
          pobj.invcount = data[i].invcount;
          pobj.totalunits = data[i].totalunits;
          pobj.totinv = OtherHelpers._formatCurrency(data[i].totinv);

          pobj.currVal = OtherHelpers._formatCurrency(
            Math.round(data[i].currval.currvalamnt)
          );
          pobj.lnavDate = data[i].currval.lastNavDate;

          pobj.gainloss = OtherHelpers._formatCurrency(
            Math.round(data[i].currval.currvalamnt - data[i].totinv)
          );

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

      if (data.opsuccess === false) {
        switch (data.errcode) {
          case 11000:
            // Error inserting data. Display the same in the message strip
            data.msg =
              "Data already exists for combination of " +
              data.operation.sname +
              " and " +
              data.operation.pdate +
              ". Please recheck";
            break;
          default:
            data.msg = "Error Occured. Please contact Admin";
        }
        that._generateMsgStrip(data.msg, true);
      } else {
        // Data inserted successfully
        var pdata = {};
        that._destroyMsgStrip(false);
        pdata = data.operation;
        pdata.pdate = DateHelpers._isodatetodate(pdata.invdate);
        return pdata;
      }
    },

    parseUpdateData: function(upddata) {
      var parseResult = {};
      if (upddata.n === upddata.nModified) {
        // No of entries given equal to number of entries modified
        parseResult.updsucc = true;
        parseResult.updmsg = "Update is successful";
      } else {
        parseResult.updsucc = false;
        parseResult.updmsg = "Update not possible. Please check with admin";
      }
      return parseResult;
    },
    checkStringInArray: function(array, srcstrpath, string) {
      /**
       * @desc This function checks if a string is present in an array of strings
       * @param array contianing the array of strings
       * @param string which needs to be checked
       * @return boolean representing whether string is present or not
       */

      for (var i = 0; i < array.length; i++) {
        if (array[i][srcstrpath] === string) {
          return true;
        }
      }
      return false;
    }
  };
});
