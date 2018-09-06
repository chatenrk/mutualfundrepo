sap.ui.define([
  "openui5_chartjs/controller/BaseController",
  '../control/ChartJSControl',
  '../control/C3JSControl',
  "../helpers/ajaxhelpers"
], function(BaseController, ChartJSControl, C3JSControl, AjaxHelpers) {
  "use strict";
  return BaseController.extend("openui5_chartjs.controller.piechart", {

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

      if (oEvt.getParameter("name") !== "piechart") {
        return;

      }

      this._getPieDetails();
    },

    _getPieDetails: function() {
      /**
       * @desc This helper method retrieves all the users from the database and shows them as a POP-UP
       */
      var that = this;
      AjaxHelpers._getAllPie().then(function(data) {
        that._getpiesuccess(data, that);
      }, function(err) {
        that._getpiefailure(err, that);
      });

    },

    _getpiesuccess: function(dbdata, that) {

      var labels = [],
        chtdata = [],
        datasets = [];
      var lineData = {},
        dsValues = {};

      var dyncolobj = {},
        dyncol = [];

      for (var i = 0; i < dbdata.length; i++) {
        labels.push(dbdata[i].type);
        chtdata.push(dbdata[i].amount);
        dyncolobj = this.dynamicColors();
        dyncol.push(dyncolobj);
      }

      dsValues.label = "Sample Pie Chart";
      dsValues.backgroundColor = dyncol;
      dsValues.data = chtdata;


      datasets.push(dsValues);

      lineData.datasets = datasets;
      lineData.labels = labels;

      var oNavModel = this.getView().getModel("piechart_model");
      oNavModel.setData(lineData);
      oNavModel.updateBindings();


    },
    _getnavfailure: function(err, that) {},

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
