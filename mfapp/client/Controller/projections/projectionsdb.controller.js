sap.ui.define(["simple_hello/Controller/BaseController"], function(
  BaseController
) {
  "use strict";
  var _oRouter;
  return BaseController.extend("simple_hello.Controller.projections.projectionsdb", {
    onInit: function() {
      this._oRouter = this.getRouter();
    },
    onTilePress: function(oEvt) {
      // Get the binding context. Pass the attached model name for this
      var oBindingContext = oEvt.getSource().getBindingContext("dbtiles_model");
      var tileid = oBindingContext.getProperty("id");

      switch (tileid) {
        case "addprojschemes": // Check and add projection schemes
          this._oRouter.navTo("showprojschemes");
          break;

        default:
          break;
      }
    }
  });
});
