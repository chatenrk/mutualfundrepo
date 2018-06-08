sap.ui
  .define(
    ["simple_hello/Controller/BaseController"],
    function(BaseController) {
      "use strict";
      var _oRouter;
      return BaseController
        .extend(
          "simple_hello.Controller.docdb", {


            onInit: function() {

              this._oRouter = this.getRouter();
            },
            onTilePress: function(oEvt) {
              // Get the binding context. Pass the attached model name for this
              var oBindingContext = oEvt.getSource().getBindingContext("dbtiles_model");
              var tileid = oBindingContext.getProperty("id");

              switch (tileid) {
                case "schchgdocdisp":                       // Scheme Change Document Tile
                  this._oRouter.navTo("schchgdocdisp");
                  break;

                default:
                  break;
              }



            }



          });
    });
