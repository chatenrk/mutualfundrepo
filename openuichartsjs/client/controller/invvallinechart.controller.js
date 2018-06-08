sap.ui.define([
  "openui5_chartjs/controller/BaseController",
  '../control/ChartJSControl',
  '../control/C3JSControl',
  "../helpers/ajaxhelpers",
], function(BaseController, ChartJSControl, C3JSControl, AjaxHelpers) {
  "use strict";

  var _schtype, _schtypename;

  return BaseController.extend("openui5_chartjs.controller.invvallinechart", {

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

      if (oEvt.getParameter("name") !== "invvallinechart") {
        return;

      }

      // this._getInvValLineDetails();
      this._getLegendData();
    },

    onSelectSchType: function(oEvt) {
      /**
       * @desc This is an event handler method of Scheme Type change. This gets the selected scheme type
       *       Further trigger the function for getSchemes by Scheme Type here
       */

      // Get the current selected key
      var selschname = [];
      var schtype = oEvt.getParameter("selectedItem").getKey();

      // Filter the retrieved scheme data by sch type selected

      this._schtype = schtype;
      for (var i = 0; i < this._schtypename.length; i++) {
        if (this._schtypename[i].schtype == this._schtype) {
          selschname.push(this._schtypename[i]);
        }
      }



      var schtypemodel = this.getView().getModel("schtypename_model");
      schtypemodel.setData(selschname);
      schtypemodel.updateBindings();

    },

    onSelectSchName: function(oEvt) {
      /**
       * @desc This is an event handler method of Scheme Name selection. This gets the selected scheme name
       *       Use the scheme name to trigger a rest call to get the scheme investment data
       */

      // Get the current selected key
      var selschname = [];
      var scode = oEvt.getParameter("selectedItem").getKey();

      var that = this;
      AjaxHelpers._getMulLineData(scode).then(function(data) {
        that._getMLineDetailssuccess(data, that);
      }, function(err) {
        that._getMLineDetailsfailure(err, that);
      });

    },

    _getLegendData: function() {
      /**
       * @desc This helper method retrieves all the users from the database and shows them as a POP-UP
       */
      var that = this;
      AjaxHelpers._getLegendData().then(function(data) {
        that._getLegendDatasuccess(data, that);
      }, function(err) {
        that._getLegendDatafailure(err, that);
      });
    },
    _getLegendDatasuccess: function(data, that) {

      var schtype = [],
        schtypename = [],
        schtypeobj = {},
        schtypenameobj = {};


      for (var i = 0; i < data.length; i++) {
        schtypeobj.schtype = data[i]._id.stype;
        schtype.push(schtypeobj);
        schtypeobj = {};

        for (var j = 0; j < data[i].legdetls.length; j++) {
          schtypenameobj.schtype = data[i].legdetls[j].stype;
          schtypenameobj.scode = data[i].legdetls[j].scode;
          schtypenameobj.sname = data[i].legdetls[j].sname;
          schtypename.push(schtypenameobj);
          schtypenameobj = {};
        }

      }

      var schtypemodel = this.getView().getModel("schtype_model");
      schtypemodel.setData(schtype);
      schtypemodel.updateBindings();
      this._schtypename = schtypename;




    },
    _getLegendDatafailure: function() {},


    _getMLineDetailssuccess: function(dbdata, that) {

      var prvscode, cntoffset = 15;
      var labels = [],
        chtdataInv = [],
        chtdataVal = [],
        lineData = [],
        datasets = [];
      var lineDataObj = {},
        dsValues = {};


      var chartdata = dbdata[0].navdetls;

      for (var j = 0; j < chartdata.length; j++) {
        if (j % cntoffset === 0) {

          labels.push(chartdata[j].date);
          chtdataInv.push(parseInt(chartdata[j].totamnt));
          chtdataVal.push(parseInt(chartdata[j].value));
        }
      }

      dsValues.label = "Total Investment";
      var dyncol = this.dynamicColors();
      dsValues.borderColor = dyncol;
      dsValues.backgroundColor = dyncol;
      dsValues.fill = false;
      dsValues.data = chtdataInv;
      datasets.push(dsValues);

      dsValues = {};
      dsValues.label = "Current Value of Investment";
      var dyncol = this.dynamicColors();
      dsValues.borderColor = dyncol;
      dsValues.backgroundColor = dyncol;
      dsValues.fill = false;
      dsValues.data = chtdataVal;
      datasets.push(dsValues);


      lineDataObj.datasets = datasets;
      lineDataObj.labels = labels;


      var oNavModel = this.getView().getModel("mulline_model");
      oNavModel.setData(lineDataObj);
      oNavModel.updateBindings();

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
