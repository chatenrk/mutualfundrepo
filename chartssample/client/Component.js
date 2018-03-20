sap.ui.define(["sap/ui/core/UIComponent"],

  function(UIComponent, Moment) {
    "use strict";
    return UIComponent.extend("charts_sample.Component", {

      init: function() {

        UIComponent.prototype.init.apply(this, arguments);
        // create the views based on the url/hash
        this.getRouter().initialize();

/*------------------------------------------------------------------------------------------------------------
        // The model data read is happening here instead of manifest.json
        // This is because, there is currently no way to set size limit for the model data via manifest
        // as it can be done via Component
--------------------------------------------------------------------------------------------------------------*/
        var oJSONModel = new sap.ui.model.json.JSONModel("models/simlinechtdata.json");
        oJSONModel.setSizeLimit(2500);
        // sap.ui.getCore().setModel(gModel, "linedata");
        this.setModel(oJSONModel, "simlinecht_model");

        var oJSONModel = new sap.ui.model.json.JSONModel("models/piechart.json");
        oJSONModel.setSizeLimit(2500);
        // sap.ui.getCore().setModel(gModel, "linedata");
        this.setModel(oJSONModel, "simpiecht_model");

        var oJSONModel = new sap.ui.model.json.JSONModel("models/navmodel.json");
        oJSONModel.setSizeLimit(2500);
        this.setModel(oJSONModel, "navgrwth_model");

        var oJSONModel = new sap.ui.model.json.JSONModel("models/mulseriesdata.json");
        oJSONModel.setSizeLimit(2500);
        // sap.ui.getCore().setModel(gModel, "linedata");
        this.setModel(oJSONModel, "mulseriescht_model");


        var oJSONModel = new sap.ui.model.json.JSONModel("models/multilinegrowth.json");
        oJSONModel.setSizeLimit(2500);
        // sap.ui.getCore().setModel(gModel, "linedata");
        this.setModel(oJSONModel, "mullinechtgwt_model");

      },

      metadata: {
        manifest: "json"
      }

    });
  });
