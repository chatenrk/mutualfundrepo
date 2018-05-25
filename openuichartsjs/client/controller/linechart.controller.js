sap.ui.define([
  "openui5_chartjs/controller/BaseController",
  '../control/ChartJSControl',
  '../control/C3JSControl'
], function(BaseController, ChartJSControl, C3JSControl) {
  "use strict";
  return BaseController.extend("openui5_chartjs.controller.line", {

    // add your controller methods here
    onInit: function() {

    },

    onAfterRendering: function() {
      //TODO: Enable control method calls
      //C3JSControl.unload(['data1']);
    }
  });
});
