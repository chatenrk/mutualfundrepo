sap.ui
  .define(
    ["simple_hello/Controller/BaseController", "sap/m/MessageToast", "	sap/ui/model/Sorter", "sap/ui/model/Filter", "../helpers/GatewayHelper"],
    function(BaseController, MessageToast, Sorter, Filter, GatewayHelper) {
      "use strict";
      var _dialog;
      return BaseController
        .extend(
          "simple_hello.Controller.schchgdocdisp", {
            onInit: function() {
              var oRouter = this.getRouter();
              oRouter.attachRouteMatched(this._handleRouteMatched, this);

              // Set the selection panel to expanded and the container panel to collapsed
              this._showschselPanel = this.getView().byId("showdocsel");
              this._showschselPanel.setExpandable(true);
              this.setPanelExpanded(this._showschselPanel, true); //Method invoked from Parent Controller


              this._showschtblPanel = this.getView().byId("showdoccont");
              this._showschtblPanel.setExpandable(true);
              this.setPanelExpanded(this._showschtblPanel, false); //Method invoked from Parent Controller

            },

            _handleRouteMatched: function(oEvt) {
              if (oEvt.getParameter("name") !== "shownavsch") {
                return;
              }

              //Get AMC Details for binding
              this._getAMCs();


            },

            onShowDoc: function() {
              this._sValidPath = jQuery.sap.getModulePath("simple_hello", "/docs/pdf/test.pdf");
              var oDocModel = this.getView().getModel("pdfdocument_model");
              var data = {};
              data.Source = this._sValidPath;
              data.Title = "TestPDF";
              data.Height = "600px";
              oDocModel.setData(data);
              oDocModel.updateBindings();

              // Set the selection panel to expanded and the container panel to collapsed
              this.setPanelExpanded(this._showschselPanel, false); //Method invoked from Parent Controller
              this.setPanelExpanded(this._showschtblPanel, true); //Method invoked from Parent Controller


            },
            _getAMCs: function() {

              /**
               * @desc This method uses the helper class to get all the AMC details from the database
               */

              var that = this;
              GatewayHelper.getAMCs().then(function(data) {
                that._getamcssuccess(data, that);
              }, function(err) {
                that._getamcsfailure(err, that);
              });

            },
            _getamcssuccess: function(data, that) {

              /**
               * @desc This method is the success event handler for the AMC ajax call.
               * @param data referring to the json array of data
               * Data obtained is set to the view's model
               */

              // Set the data to AMC model
              var amcModel = this.getView().getModel("amc_model");
              amcModel.setData(data);
              amcModel.updateBindings();

            },
            _getamcsfailure: function(err, that) {

              /**
               * @desc This method is the failure event handler for the AMC ajax call.
               * @param err referring to the error passed by the AJAX Call
               */

            },

            onFHChange: function(oEvt) {

              /**
               * @desc This method acts as the event handler listening for the change in AMC combobox
               * @param This uses a oEvt variable which has the data for the selected entry
               * This invokes the call to retrieve all the schemes for the selected AMC
               */

              // Get the current selected key
              var amccode = oEvt.getParameter("selectedItem").getKey();
              this._amccode = amccode;
              this._getSchemes(amccode);
            },
            _getSchemes: function(amccode) {

              /**
               * @desc This method calles the gateway helper class to retrieve all the schemes for a AMC
               * @param amccode referring to the code for AMC
               */

              var that = this;
              GatewayHelper.getSchemes(amccode).then(function(data) {
                that._getschemessuccess(data, that);
              }, function(err) {
                that._getschemesfailure(err, that);
              });

            },
            _getschemessuccess: function(data, that) {
              /**
               * @desc This method is the success event handler for the Schemes ajax call.
               * @param data referring to the json array of data
               * Data obtained is shown as a popup to the user for selection
               */

              this._schdata = data;

              // Set the data to Scheme model
              var selschModel = this.getView().getModel("selSchModel");
              selschModel.setData([]);
              selschModel.setData(data);
              selschModel.updateBindings();

              this._showSchemesPopup(selschModel);

            },
            _getschemesfailure: function(err, that) {

              /**
               * @desc This method is the failure event handler for the scheme ajax call.
               * @param err referring to the error passed by the AJAX Call
               */

            },

            _showSchemesPopup: function(selschModel) {

              /**
               * @desc This method shows all the schemes fetched as a pop-up allowing the user to select one scheme.
               * @param selschModel referring model for selected schemes. This is bound to the pop-up
               */



              if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("simple_hello.view.schemeselect", this);

              }

              this._oDialog.setModel(null, "selschModel");
              this._oDialog.setModel(selschModel, "selschModel");

              // toggle compact style
              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
              this._oDialog.open();

            },

            handleSearch: function(oEvent) {

              /**
               * @desc This method is the event handler for the search of pop-up for schemes.
               * @param oEvent referring to the selected scheme in the pop-up
               */

              var sValue = oEvent.getParameter("value");
              var oFilter = new sap.ui.model.Filter("sname", sap.ui.model.FilterOperator.Contains, sValue);

              var oBinding = oEvent.getSource().getBinding("items");
              oBinding.filter([oFilter]);
            },

            handleClose: function(oEvent) {

              /**
               * @desc This method is the event handler for the close of pop-up for schemes.
               * @param oEvent referring to the selected scheme in the pop-up
               */


              var aContexts = oEvent.getParameter("selectedContexts");
              if (aContexts && aContexts.length) {
                var mfname = this.getView().byId("mfname");
                this._sname = aContexts.map(function(oContext) {
                  return oContext.getObject().sname;
                });
                mfname.setValue(this._sname);
                this._scode = aContexts.map(function(oContext) {
                  return oContext.getObject().scode;
                });
              }
              oEvent.getSource().getBinding("items").filter([]);
            },

            onGetNAV: function() {

              /**
               * @desc This method is the event handler for GET NAV button.
               */

              var scode = this._scode[0];
              var limit = 10;
              var sorder = "DSC";
              var that = this;
              GatewayHelper.getFewNav(scode, limit, sorder).then(function(data) {
                that._getnavssuccess(data, that);
              }, function(err) {
                that._getnavsfailure(err, that);
              });


            },
            _getnavssuccess: function(data, that) {

              /**
               * @desc This method is the success event handler for the NAVs ajax call.
               * @param data referring to the json array of data
               */

              // Check if there is some data and attach it to the model
              var pdata = this._parseNAVData(data);
              var fewnavmodel = this.getView().getModel("fewnavmodel");
              fewnavmodel.setData([]);
              fewnavmodel.setData(pdata);
              fewnavmodel.updateBindings();


              // Set the selection panel to collapsed and the table panel to expanded
              this.setPanelExpanded(this._showschselPanel, false); //Method invoked from Parent Controller
              this.setPanelExpanded(this._showschtblPanel, true); //Method invoked from Parent Controller

            },
            _getnavsfailure: function(err, that) {
              /**
               * @desc This method is the failure event handler for the NAVs ajax call.
               * @param err referring to the error passed by the AJAX Call
               */

            },
            _parseNAVData: function(data) {

              var pobj = {},
                parray = [];
              for (var i = 0; i < data.length; i++) {
                pobj = data[i];
                pobj.datefmtd = this._isodatetodate(data[i].date);
                parray.push(pobj);
                pobj = {};
              }
              return parray;
            },

            onRefresh: function() {

              this.getView().byId("cbfname").setValue("");
              this.getView().byId("mfname").setValue("");

              // Set the table binding to empty
              var mfinsmodel = this.getView().getModel("fewnavmodel");
              mfinsmodel.setData([]);
              mfinsmodel.updateBindings();

              // Collapse the table panel and Expand the input panel
              this.setPanelExpanded(this._showschselPanel, true);
              this.setPanelExpanded(this._showschtblPanel, false);
            }



          });
    });
