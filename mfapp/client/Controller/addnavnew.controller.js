sap.ui.define(
  [
    "simple_hello/Controller/BaseController",
    "sap/m/MessageToast",
    "	sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "../helpers/GatewayHelper"
  ],
  function(BaseController, MessageToast, Sorter, Filter, GatewayHelper) {
    "use strict";
    var _dialog;
    return BaseController.extend("simple_hello.Controller.addnavnew", {
      onInit: function() {
        var oRouter = this.getRouter();
        oRouter.attachRouteMatched(this._handleRouteMatched, this);

        // Set the selection panel to expanded and the table panel to collapsed
        this._showschselPanel = this.getView().byId("showschsel");
        this._showschselPanel.setExpandable(true);
        this.setPanelExpanded(this._showschselPanel, true); //Method invoked from Parent Controller

        this._showschtblPanel = this.getView().byId("showschtbl");
        this._showschtblPanel.setExpandable(true);
        this.setPanelExpanded(this._showschtblPanel, false); //Method invoked from Parent Controller
      },

      _handleRouteMatched: function(oEvt) {
        if (oEvt.getParameter("name") !== "addnavdetnew") {
          return;
        }

        //Get AMC Details for binding
        this._getAMCs();
      },

      /**
      * @desc This method uses the helper class to get all the AMC details from the database
      */

      _getAMCs: function() {
        var that = this;
        GatewayHelper.getAMCs().then(
          function(data) {
            that._getamcssuccess(data, that);
          },
          function(err) {
            that._getamcsfailure(err, that);
          }
        );
      },
      /**
        * @desc This method is the success event handler for the AMC ajax call.
        * @param data referring to the json array of data
        * Data obtained is set to the view's model
        */
      _getamcssuccess: function(data, that) {
        // Set the data to AMC model
        var amcModel = this.getView().getModel("amc_model");
        amcModel.setData(data);
        amcModel.updateBindings();
      },

      /**
      * @desc This method is the failure event handler for the AMC ajax call.
      * @param err referring to the error passed by the AJAX Call
      */
      _getamcsfailure: function(err, that) {},

      onFHChange: function(oEvt) {},

      onGetNAV: function() {
        /**
        * @desc This method is the event handler for GET NAV button.
        */
      },

      onRefresh: function() {}
    });
  }
);
