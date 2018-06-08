sap.ui.define([
  "openui5_chartjs/controller/BaseController",
  '../control/ChartJSControl',
  '../control/C3JSControl',
  "../helpers/ajaxhelpers"
], function(BaseController, ChartJSControl, C3JSControl, AjaxHelpers) {
  "use strict";
  return BaseController.extend("openui5_chartjs.controller.mullinechart", {

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

      if (oEvt.getParameter("name") !== "mullinechart") {
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
      var prvscode, cntoffset = 15;
      var labels = [],
        chtdata = [],
        lineData = [],
        datasets = [];
      var lineDataObj = {},
        dsValues = {};


      for (var i = 0; i < dbdata.length; i++) {

        labels = [];
        chtdata = [];
        dsValues = {};
        chartdata = [];

        var chartdata = dbdata[i].navdetls;

        for (var j = 0; j < chartdata.length; j++) {
          if (j % cntoffset === 0) {
            labels.push(chartdata[j].date);
            chtdata.push(parseInt(chartdata[j].value - chartdata[j].totamnt));
          }
        }

        dsValues.label = dbdata[i]._id.sname;
        var dyncol = this.dynamicColors();
        dsValues.borderColor = dyncol;
        dsValues.backgroundColor = dyncol;
        dsValues.fill = false;
        // dsValues.fillColor = "rgb(255, 159, 64)";
        // // dsValues.fillColor = this.dynamicColors();
        // // dsValues.strokeColor = "rgba(220,220,220,1)";
        // dsValues.strokeColor = this.dynamicColors();
        // dsValues.pointColor = "rgb(255, 159, 64)";
        // // dsValues.pointColor = this.dynamicColors();
        // dsValues.pointStrokeColor = "#fff";
        // dsValues.pointHighlightFill = "#fff";
        // dsValues.pointHighlightStroke = "rgba(220,220,220,1)";
        dsValues.data = chtdata;
        datasets.push(dsValues);

      }
      lineDataObj.datasets = datasets;
      lineDataObj.labels = labels;
      // lineData.push(lineDataObj);

      var oNavModel = this.getView().getModel("mulline_model");
      oNavModel.setData(lineDataObj);
      oNavModel.updateBindings();

      // var labels = [],
      //   chtdata = [],
      //   datasets = [];
      // var lineData = {},
      //   dsValues = {};
      //
      // var totcnt = dbdata.length;
      // var cntoffset;
      //
      // var prvscode
      //
      // if (totcnt < 15) {
      //   cntoffset = 1;
      // }
      // else {
      //   cntoffset =15;
      // }
      //
      // for (var i = 0; i < dbdata.length; i++) {
      //
      //   if (i % cntoffset === 0) {
      //     labels.push(dbdata[i].date);
      //     chtdata.push(dbdata[i].nav);
      //   }
      // }
      //
      // dsValues.label = "Sample NAV Line";
      // dsValues.fillColor = "rgba(220,220,220,0.2)";
      // dsValues.strokeColor = "rgba(220,220,220,1)";
      // dsValues.pointColor = "rgba(220,220,220,1)";
      // dsValues.pointStrokeColor = "#fff";
      // dsValues.pointHighlightFill = "#fff";
      // dsValues.pointHighlightStroke = "rgba(220,220,220,1)";
      // dsValues.data = chtdata;
      //
      // datasets.push(dsValues);
      //
      // lineData.datasets = datasets;
      // lineData.labels = labels;
      //
      // var oNavModel = this.getView().getModel("navline_model");
      // oNavModel.setData(lineData);
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
      //TODO: Enable control method calls
      //C3JSControl.unload(['data1']);
    }
  });
});
