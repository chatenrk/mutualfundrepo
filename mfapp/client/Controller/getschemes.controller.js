sap.ui
  .define(
    ["simple_hello/Controller/BaseController", "sap/m/MessageToast", "	sap/ui/model/Sorter", "sap/ui/model/Filter", "sap/ui/core/Fragment", "../helpers/GatewayHelper", "../helpers/MessageHelpers", "../helpers/ParsingHelpers"],
    function(BaseController, MessageToast, Sorter, Filter, Fragment, GatewayHelper, MessageHelpers, ParsingHelpers) {
      "use strict";
      var _dialog;
      return BaseController
        .extend(
          "simple_hello.Controller.getschemes", {
            onInit: function() {

              /**
               * @desc This is a lifecycle hook method that is called when the view is initialized
               * Useful for initialization of the any parameters, adding dependent event handlers etc
               * Here it is used to subscribe to the handleRouteMatched event of the router and toggling the panels
               *
               */

              var oRouter = this.getRouter();
              oRouter.attachRouteMatched(this._handleRouteMatched, this);

            },

            _handleRouteMatched: function(oEvt) {

              /**
               * @desc This it the event callback method that is registered for the handleRouteMatched event
               *       It triggers on every route match. Any data fetches/refreshes can be performed in this method
               * @param oEvt{object} referencing to the route matched event triggered via navigation
               */

              if (oEvt.getParameter("name") !== "getschemes") {
                return;
              }
              this._getSchemes();
            },
            _getSchemes: function() {

              /**
               * @desc This helper method is used to fetch all the schemes from the database
               *       It calls the gateway helper method and gets a promise
               */

              // instantiate dialog
              if (!this._dialog) {
                this._dialog = sap.ui.xmlfragment("simple_hello.view.busydialog", this);
                this.getView().addDependent(this._dialog);
              }

              // open dialog
              var oJSONModel = this.getJSONModel();
              var data = {
                title: "Get Scheme Data",
                text: "Retrieving all scheme data from Database. Please wait"
              }

              oJSONModel.setData(data);
              this.getView().setModel(oJSONModel, "busyDialog");

              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
              this._dialog.open();

              //Query and get the data
              var that = this;
              GatewayHelper.getAllSchemes().then(function(data) {
                that._getschsuccess(data, that);
              }, function(err) {
                that._getschfailure(err, that);
              });

            },

            _getschsuccess: function(data, that) {

              /**
               * @desc This is a success event callback method for the get AMC's
               */

              // Close the busy dialog
              if (that._dialog) {
                that._dialog.close();
              }

              // Set the data to scheme model
              var schModel = this.getView().getModel("scheme_model");
              schModel.setData(data);
              schModel.updateBindings();
            },
            _getschfailure: function(err, that) {
              /**
               * @desc This is a failure event callback method for the get AMC's
               */

              // Close the busy dialog
              if (that._dialog) {
                that._dialog.close();
              }
            },

            onSchSearch: function(oEvt) {
              /**
               * @desc This is the event callback method for search event genratea from user search
               * @param oEvt{object} referencing to the route matched event triggered on search
               */

              // add filter for search
              var aFilters = [];
              var sQuery = oEvt.getSource().getValue();
              if (sQuery && sQuery.length > 0) {
                var filter = new Filter("sname", sap.ui.model.FilterOperator.Contains, sQuery);
                aFilters.push(filter);
              }

              var oView = this.getView();
              var oTable = oView.byId("schdatatable");
              var oBinding = oTable.getBinding("items");
              oBinding.filter(aFilters, "Application");
            },

            handlePopOverPress: function(oEvt) {

              /**
               * @desc This is the event callback method for event raised when the user clicks on the scheme link
               *       This opens a pop-up which displays the scheme data. It also has an edit button that can
               *       be used to change the scheme name
               * @param oEvt{object} referencing to the route matched event triggered on link clicking
               */

              if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("schchgpopover", "simple_hello.view.schchgpopover", this);
                this.getView().addDependent(this._oPopover);
                this._oPopover.attachAfterOpen(function() {
                  this.disablePointerEvents();
                }, this);
                this._oPopover.attachAfterClose(function() {
                  this.enablePointerEvents();
                }, this);
              }

              var oCtx = oEvt.getSource().getBindingContext("scheme_model");
              var sPath = oCtx.getPath();
              this._oPopover.bindElement({
                path: sPath,
                model: "scheme_model"
              });

              // delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
              var oControl = oEvt.getSource();
              this._oPopover.openBy(oControl);
            },

            handleClose: function(oEvt) {

              /**
               * @desc This is the event callback method for search event genratea from popover close
               * @param oEvt{object} referencing to the route matched event triggered on popover close
               */

              var sname_ipfield = Fragment.byId("schchgpopover", "sname_ipfield");
              sname_ipfield.setEditable(false);

              // UnHide the edit button and hide the update button
              var save_button = Fragment.byId("schchgpopover", "save");
              save_button.setVisible(false);

              var edit_button = Fragment.byId("schchgpopover", "edit");
              edit_button.setVisible(true);



              if (this._oPopover) {
                this._oPopover.close();

                // // Refresh and dump any unwated changes. Currently the only way to do this is to
                // // retrigger the fetch query
                // MessageHelpers._msgbox("confirm", "Discard changes made in the form", "Discard Changes", this._closePopOver,this);
                //
                // // this._owninvrestcall(this._invBy);

              }
            },
            handleEditRow: function(oEvt) {

              /**
               * @desc This is the event callback method for search event genratea from user clicking edit button in popup
               * @param oEvt{object} referencing to the route matched event triggered on user clicking edit button in popup
               */

              var sname_ipfield = Fragment.byId("schchgpopover", "sname_ipfield");
              sname_ipfield.setEditable(true);

              // Hide the edit button and enable the update button
              var save_button = Fragment.byId("schchgpopover", "save");
              save_button.setVisible(true);

              var edit_button = Fragment.byId("schchgpopover", "edit");
              edit_button.setVisible(false);

            },

            handleSave: function(oEvt) {

              /**
               * @desc This is the event callback method for search event genratea from user clicking save button in popup
               * @param oEvt{object} referencing to the route matched event triggered on user clicking save button in popup
               */
              var that = this;
              var updschdata = oEvt.getSource().getBindingContext("scheme_model").getObject();
              GatewayHelper.updateSchemeData(updschdata).then(function(data) {
                  var parseResult = ParsingHelpers.parseUpdateData(data);
                  MessageHelpers._msgbox("info", parseResult.updmsg, "Update Result", that._closePopOver, that);
                },
                function(err) {
                  // that._getschupdfailure(err, that);
                });
            },
            _closePopOver: function(oAction, that) {
              // if (oAction === MessageBox.Action.OK) {}
            },

            disablePointerEvents: function() {
              this.byId("schdatatable").$().css("pointer-events", "none");
            },

            enablePointerEvents: function() {
              this.byId("schdatatable").$().css("pointer-events", "all");
            },

            handleViewSettingsDialogButtonPressed: function(oEvent) {
              if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("simple_hello.view.TableViewSettingsDialog", this);
              }
              // toggle compact style
              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
              this._oDialog.open();
            },
            handleVSConfirm: function(oEvent) {
              // This is called when the OK button is pressed in the view settings dialog

              var oView = this.getView();
              var oTable = oView.byId("schdatatable");

              var mParams = oEvent.getParameters();
              var oBinding = oTable.getBinding("items");

              var sPath;
              var bDescending;
              var aSorters = [];

              sPath = mParams.sortItem.getKey();
              bDescending = mParams.sortDescending;
              aSorters.push(new Sorter(sPath, bDescending));
              oBinding.sort(aSorters);

            },

          });
    });
