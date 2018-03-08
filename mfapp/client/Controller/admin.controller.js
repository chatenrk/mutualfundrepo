sap.ui
  .define(
    ["simple_hello/Controller/BaseController", "sap/m/MessageToast", 'sap/m/Popover', 'sap/m/Button',
      'sap/m/MessageStrip', 'sap/m/MessageToast', 'sap/m/GenericTile'
    ],
    function(BaseController, MessageToast, Popover, Button, MessageStrip, GenericTile) {
      "use strict";
      var _oRouter;
      return BaseController
        .extend(
          "simple_hello.Controller.admin", {


            onInit: function() {

              this._oRouter = this.getRouter();
            },
            onTilePress: function(oEvt) {
              // Get the binding context. Pass the attached model name for this
              var oBindingContext = oEvt.getSource().getBindingContext("dbtiles_model");
              var tileid = oBindingContext.getProperty("id");

              switch (tileid) {
                case "onGetSchdet":
                  this._oRouter.navTo("getschemes");
                  break;

                case "onAddSchDet":
                  this._oRouter.navTo("addschemes");
                  break;

                case "addamcdet":
                  this._oRouter.navTo("addamcs");
                  break;
                case "addSchemedet":
                  this._oRouter.navTo("addmultischdet");
                  break;
                case "addnavdet":
                  this._oRouter.navTo("addnav");
                  break;
                case "addmultnav":
                  this._oRouter.navTo("addmultnav");
                  break;
                case "addmultiinvdet":
                  this._oRouter.navTo("addmultiinvdet");
                  break;
                case "manageinv":
                  this._oRouter.navTo("manageinv");
                  break;
                case "shownav":
                  this._oRouter.navTo("shownavsch");
                  break;
                default:
                  break;
              }



            }



          });
    });
