sap.ui.define(
  [
    "simple_hello/Controller/BaseController",
    "../../helpers/GatewayHelper",
    "../../helpers/OtherHelpers"
  ],
  function(BaseController, GatewayHelper, OtherHelpers) {
    "use strict";
    var _oRouter;
    return BaseController.extend(
      "simple_hello.Controller.projections.addprojschemes",
      {
        onInit: function() {
          var oRouter = this.getRouter();
          oRouter.attachRouteMatched(this._handleRouteMatched, this);

          this._oNavContainer = this.byId("wizardNavContainer");
          this._oWizardContentPage = this.byId("wizardContentPage");
          this._wizard = this.byId("AddProjectionSchemeWizard");
          this._oWizardReviewPage = sap.ui.xmlfragment(
            "simple_hello.view.projections.addprojreview",
            this
          );
          this._oNavContainer.addPage(this._oWizardReviewPage);

          this._finalModel = this.getJSONModel();
          this.getView().setModel(this._finalModel,"finalModel");

        },
        _handleRouteMatched: function(oEvt) {
          if (oEvt.getParameter("name") !== "addprojschemes") {
            return;
          }

          //Get Scheme Details for binding
          this._getProjSchCat();
        },

        /**
        * @desc This method uses the helper class to get all projection scheme categories from database
        */

        _getProjSchCat: function() {
          var that = this;
          GatewayHelper._getProjSchCat().then(
            function(data) {
              that._getProjSchCatSuccess(data, that);
            },
            function(err) {
              that._getProjSchCatFailure(err, that);
            }
          );
        },

        /**
        * @desc This method is the success event handler for the AMC ajax call.
        * @param data referring to the json array of data
        * Data obtained is set to the view's model
        */

        _getProjSchCatSuccess: function(data, that) {
          // // Filter the data for unique values
          // var fdata = OtherHelpers._findUnique(data, "schcat");

          // Set the scheme data to projection
          var projSchCatModel = this.getView().getModel("projschcatfilt_model");
          projSchCatModel.setData(data);
          projSchCatModel.updateBindings();

          // // Set complete projection data
          // var projModel = this.getView().getModel("projschcat_model");
          // projModel.setData(data);
          // projModel.updateBindings();
        },

        /**
         * @desc This method is the failure event handler for the AMC ajax call.
         * @param err referring to the error passed by the AJAX Call
         */
        _getProjSchCatFailure: function(err, that) {},

        /**
        * @desc This method uses the helper class to get all the projection schemes from database
        */

        _getProjSchemes: function() {
          var that = this;
          GatewayHelper._getprojcatandfunds().then(
            function(data) {
              that._getprojsuccess(data, that);
            },
            function(err) {
              that._getprojfailure(err, that);
            }
          );
        },

        /**
        * @desc This method is the success event handler for the AMC ajax call.
        * @param data referring to the json array of data
        * Data obtained is set to the view's model
        */

        _getprojsuccess: function(data, that) {
          // // Filter the data for unique values
          // var fdata = OtherHelpers._findUnique(data, "schcat");

          // // Set the scheme data to projection
          // var projSchCatModel = this.getView().getModel("projschcatfilt_model");
          // projSchCatModel.setData(fdata);
          // projSchCatModel.updateBindings();

          // Set complete projection data
          var projModel = this.getView().getModel("projschcat_model");
          projModel.setData(data);
          projModel.updateBindings();
        },

        /**
         * @desc This method is the failure event handler for the AMC ajax call.
         * @param err referring to the error passed by the AJAX Call
         */
        _getprojfailure: function(err, that) {},

        /**
         * @desc This method acts as the event handler listening for the change in Scheme Category combo box
         * @param This uses a oEvt variable which has the data for the selected entry
        */

        onFHChange: function(oEvt) {
          var data = this.getView().getModel("finalModel").getData();
          data.schCat = oEvt.getSource().getValue();
          this.getView()
            .byId("SchTypeStep")
            .setValidated(true);
        },
        handleSelectSchemeDialog: function() {
          var that = this;
          GatewayHelper.getAllSchemes().then(
            function(data) {
              that._getschemessuccess(data, that);
            },
            function(err) {
              that._getschemesfailure(err, that);
            }
          );
        },

        _getschemessuccess: function(data, that) {
          var selschModel = this.getView().getModel("selSchModel");
          selschModel.setData(data);

          if (!this._oDialog) {
            this._oDialog = sap.ui.xmlfragment(
              "simple_hello.view.schemeselect",
              this
            );
          }

          this._oDialog.setModel(null, "selschModel");
          this._oDialog.setModel(selschModel, "selschModel");

          // toggle compact style
          jQuery.sap.syncStyleClass(
            "sapUiSizeCompact",
            this.getView(),
            this._oDialog
          );
          this._oDialog.open();
        },
        _getschemesfailure: function() {},

        /**
        * @desc This method is the event handler for the close of pop-up for schemes.
        * @param oEvent referring to the selected scheme in the pop-up
        */
        handleClose: function(oEvent) {
          var data = this.getView().getModel("finalModel").getData();
          var aContexts = oEvent.getParameter("selectedContexts");
          if (aContexts && aContexts.length) {
            var mfname = this.getView().byId("mfname");
            var selSchHBox = this.getView().byId("selSchHBox");
            this._sname = aContexts.map(function(oContext) {
              return oContext.getObject().sname;
            });

            selSchHBox.setVisible(true);
            mfname.setText(this._sname);
             
            this.getView()
              .byId("SelScheme")
              .setValidated(true);

            this._scode = aContexts.map(function(oContext) {
              return oContext.getObject().scode;
            });

            data.sname = this._sname;
            data.scode = this._scode;
          }
          oEvent
            .getSource()
            .getBinding("items")
            .filter([]);
        },

        /**
        * @desc This method is the event handler for the search of pop-up for schemes.
        * @param oEvent referring to the selected scheme in the pop-up
        */
        handleSearch: function(oEvent) {
          var sValue = oEvent.getParameter("value");
          var oFilter = new sap.ui.model.Filter(
            "sname",
            sap.ui.model.FilterOperator.Contains,
            sValue
          );

          var oBinding = oEvent.getSource().getBinding("items");
          oBinding.filter([oFilter]);
        },

        finalValidation: function() {
          var mfname = this.getView().byId("mfname");
          if (mfname.length === 0) {
            this._wizard.invalidateStep(this.byId("SelRefFund"));
          } else {
            this._wizard.validateStep(this.byId("SelRefFund"));
          }
        },
        completedHandler: function() {
          var data = this.getView().getModel("finalModel").getData();
         
          this._oNavContainer.to(this._oWizardReviewPage);
        }
      }
    );
  }
);
