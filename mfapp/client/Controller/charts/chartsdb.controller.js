sap.ui.define(
  [
    "simple_hello/Controller/BaseController",
    "sap/m/GenericTile",
    "sap/m/TileContent",
    "sap/m/ImageContent"
  ],
  function(BaseController, GenericTile, TileContent, ImageContent) {
    "use strict";
    var _oRouter;
    return BaseController.extend("simple_hello.Controller.charts.chartsdb", {
      /**
       * Lifecycle method onInit. This is used to get an instance of the router
       *
       *-------------------------------------------------------------------------
       * Version History Changes
       * ------------------------------------------------------------------------
       * @version: 0.1
       * @author: Chaitanya Rayabharam
       * @description: Initial Version
       *------------------------------------------------------------------------
       */

      onInit: function() {
        this._oRouter = this.getRouter();
        this._getTiles("LineChtsColl");
      },
      _getTiles: function(collName) {
        var that = this;
        var tilesColl = this.getOwnerComponent()
          .getModel("dbtiles_model")
          .getData()[collName];

        var oPage = this.getView().byId("chartsdbpage");
        var oController = this.getView().getController();

        for (var i = 0; i < tilesColl.length; i++) {
          var oImageContent = new ImageContent({
            src: tilesColl[i].icon
          });
          var oTileContent = new TileContent({
            content: oImageContent
          });
          var oGenericTile = new GenericTile({
            header: tilesColl[i].title,
            tileContent: oTileContent,
            press: function(oEvt){
              oController.onTilePress(oEvt,that)
            }
          });

          oGenericTile.addStyleClass(
            "sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout"
          );
          // oGenericTile.attachPress("onTilePress");

          oPage.addContent(oGenericTile);
        }
      },

      /**
       * event handler  method for tile press event
       *
       *-------------------------------------------------------------------------
       * Version History Changes
       * ------------------------------------------------------------------------
       * @version: 0.1
       * @author: Chaitanya Rayabharam
       * @description: Initial Version
       *------------------------------------------------------------------------
       */
      onTilePress: function(oEvt,that) {
        // Get the binding context. Pass the attached model name for this
        
        // var tileid = oBindingContext.getProperty("id");
        var ttitle = oEvt.getSource()._oTitle.mProperties.text;
        that._oRouter.navTo("mullinechart", { chttype: ttitle });
      }
    });
  }
);
