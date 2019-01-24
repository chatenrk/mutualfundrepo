sap.ui.define([
  "proj_chartdb/controller/BaseController",
  '../../controls/ChartJSControl',
  '../../helpers/ajaxhelpers'
], function(BaseController, ChartJSControl, AjaxHelpers) {
  "use strict";
  return BaseController.extend("proj_chartdb.controller.catcompchart", {

    // add your controller methods here
    onInit: function() {

      /**
       * @desc This is a lifecycle hook method that is called when the view is initialized
       * Useful for initialization of the any parameters, adding dependent event handlers etc
       * Here it is used to subscribe to the handleRouteMatched event of the router
       *
       */

      var oRouter = this.getRouter();
      oRouter.attachRouteMatched(this._handleRouteMatched, this);

    },

    _handleRouteMatched: function(oEvt) {

      /**
       * @desc This it the event callback method that is registered for the handleRouteMatched event
       *       It triggers on every route match. Any data fetches/refreshes can be performed in this method
       * @param oEvt{object} referencing to the route matched event triggered via navigation
       */

      if (oEvt.getParameter("name") !== "pharmachart") {
        return;

      }

      this._getMLineDetails();
    },

    _getMLineDetails: function() {
      /**
       * @desc This helper method retrieves all the users from the database and shows them as a POP-UP
       */
      var that = this;
      AjaxHelpers._getMulLineData().then(function(data) {
        that._getMLineDetailssuccess(data, that);
      }, function(err) {
        that._getMLineDetailsfailure(err, that);
      });

    },

    _getMLineDetailssuccess: function(dbdata, that) {
     
      // var prvscode, cntoffset = 15;
      // var labels = [],
      //   chtdata = [],
      //   lineData = [],
      //   datasets = [];
      // var lineDataObj = {},
      //   dsValues = {};


      // for (var i = 0; i < dbdata.length; i++) {

      //   labels = [];
      //   chtdata = [];
      //   dsValues = {};
      //   chartdata = [];

      //   var chartdata = dbdata[i];

      //   for (var j = 0; j < chartdata.length; j++) {
      //     if (j % cntoffset === 0) {
      //       labels.push(chartdata[j].date);
      //       chtdata.push(parseInt(chartdata[j].value - chartdata[j].totamnt));
      //     }
      //   }

      //   dsValues.label = dbdata[i]._id.sname;
      //   var dyncol = this.dynamicColors();
      //   dsValues.borderColor = dyncol;
      //   dsValues.backgroundColor = dyncol;
      //   dsValues.fill = false;
      
      //   dsValues.data = chtdata;
      //   datasets.push(dsValues);

      }
      // lineDataObj.datasets = datasets;
      // lineDataObj.labels = labels;
      // // lineData.push(lineDataObj);

      // var oNavModel = this.getView().getModel("mulline_model");
      // oNavModel.setData(lineDataObj);
      // oNavModel.updateBindings();
    


    },

    dynamicColors: function() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);

      return "rgb(" + r + "," + g + "," + b + ")";
    },
    _getMLineDetailsfailure: function(err, that) {},


    _parseMulLineData(dbdata) {

    },

    onAfterRendering: function() {
     
    }
  });
});
