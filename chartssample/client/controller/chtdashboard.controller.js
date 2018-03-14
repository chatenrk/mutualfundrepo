sap.ui
  .define(
    ["charts_sample/controller/BaseController"],
    function(BaseController) {
      "use strict";
      var _oRouter;
      return BaseController
        .extend(
          "charts_sample.controller.chtdashboard", {

            onInit: function() {
              this._oRouter = this.getRouter();
            },
            onTilePress: function(oEvt) {
              // Get the binding context. Pass the attached model name for this
              var oBindingContext = oEvt.getSource().getBindingContext("dbtiles_model");
              var tileid = oBindingContext.getProperty("id");

              switch (tileid) {
                case "onShowLineChart":
                  this._oRouter.navTo("simplelinechart");
                  break;
                //
                // case "getamcdet":
                //   this._oRouter.navTo("getamcs");
                //   break;
                //
                // case "onAddSchDet":
                //   this._oRouter.navTo("addschemes");
                //   break;
                //
                //
                //
                default: break;
              }
            }
          });
    });
