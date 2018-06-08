sap.ui.define([
  "sap/ui/core/mvc/Controller",
  '../control/ChartJSControl',
  '../control/C3JSControl'
], function(Controller, ChartJSControl, C3JSControl) {
  "use strict";
  return Controller.extend("openui5_chartjs.controller.main", {

    // add your controller methods here
    onInit: function() {

    },

    onAfterRendering: function() {
      //TODO: Enable control method calls
      //C3JSControl.unload(['data1']);
    }
  });
});
