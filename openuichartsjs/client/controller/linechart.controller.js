sap.ui.define([
  "openui5_chartjs/controller/BaseController",
  '../control/ChartJSControl',
  '../control/C3JSControl',
  "../helpers/ajaxhelpers"
], function(BaseController, ChartJSControl, C3JSControl, AjaxHelpers) {
  "use strict";
  return BaseController.extend("openui5_chartjs.controller.linechart", {

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

      if (oEvt.getParameter("name") !== "linechart") {
        return;

      }

      this._getNAVDetails();
    },

    _getNAVDetails: function() {
      /**
       * @desc This helper method retrieves all the users from the database and shows them as a POP-UP
       */
      var that = this;
      AjaxHelpers._getAllNAV().then(function(data) {
        that._getnavsuccess(data, that);
      }, function(err) {
        that._getnavfailure(err, that);
      });

    },

    _getnavsuccess: function(dbdata, that) {

      var labels = [],
        chtdata = [],
        datasets = [];
      var lineData = {},
        dsValues = {};
      for (var i = 0; i < dbdata.length; i++) {
        labels.push(dbdata[i].date);
        chtdata.push(dbdata[i].nav);

      }

      dsValues.label = "Sample NAV Line";
      dsValues.fillColor = "rgba(220,220,220,0.2)";
      dsValues.strokeColor = "rgba(220,220,220,1)";
      dsValues.pointColor = "rgba(220,220,220,1)";
      dsValues.pointStrokeColor = "#fff";
      dsValues.pointHighlightFill = "#fff";
      dsValues.pointHighlightStroke = "rgba(220,220,220,1)";
      dsValues.data = chtdata;

      datasets.push(dsValues);

      lineData.datasets = datasets;
      lineData.labels = labels;

      var oNavModel = this.getView().getModel("navline_model");
      oNavModel.setData(lineData);
      oNavModel.updateBindings();


    },
    _getnavfailure: function(err, that) {},

    onAfterRendering: function() {
      //TODO: Enable control method calls
      //C3JSControl.unload(['data1']);
    }
  });
});
