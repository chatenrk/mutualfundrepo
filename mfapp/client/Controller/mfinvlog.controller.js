sap.ui
  .define(
    ["simple_hello/Controller/BaseController", "../helpers/GatewayHelper", "../helpers/ParsingHelpers", "sap/m/MessageToast", 'sap/m/Popover', 'sap/m/Button',
      'sap/m/MessageStrip', 'sap/m/MessageToast', 'sap/ui/model/Filter', 'simple_hello/libs/Moment'
    ],
    function(BaseController, GatewayHelper, ParsingHelpers, MessageToast, Popover, Button, MessageStrip, Filter, Moment) {
      "use strict";

      var _oStorage, _oMessageStrip, _amcdata, _schdata, _sname, _scode, _amccode, _navdata;
      var _invdetPanel, _invtabPanel;
      var _lgndata;
      jQuery.sap.require("jquery.sap.storage");
      return BaseController
        .extend(
          "simple_hello.Controller.mfinvlog", {


            onInit: function() {

              /**
               * @desc This is a lifecycle hook method that is called when the view is initialized
               * Useful for initialization of the any parameters, adding dependent event handlers etc
               * Here it is used to subscribe to the handleRouteMatched event of the router and toggling the panels
               *
               */

              this._oMessageStrip = this.getView().byId("msgstrp");
              var oRouter = this.getRouter();
              oRouter.attachRouteMatched(this._handleRouteMatched, this);
              this.oSF = this.getView().byId("searchField");

              this._invdetPanel = this.getView().byId("mfinvdet");
              this._invdetPanel.setExpandable(true);
              this.setPanelExpanded(this._invdetPanel, true);

              this._invtabPanel = this.getView().byId("mfinvtab");
              this._invtabPanel.setExpandable(true);
              this.setPanelExpanded(this._invtabPanel, false);

              this._getLoginData();
              if (this._lgndata.user.name !== "") {
                // Invoke the AJAX call for retrieving the Goals data
                this._getInvestFor(this._lgndata.user.name);
              }


            },
            onExit: function() {

              /**
               * @desc This is a lifecycle hook method that is called when the view is destroyed
               * Here it is used to destroy the instance of the dialog created
               *
               */

              if (this._oDialog) {
                this._oDialog.destroy();
              }
            },

            onBeforeRendering: function() {

              /**
               * @desc This is a lifecycle hook method that is called before a view is rendered
               * Useful for initialization of the any parameters, adding dependent event handlers etc
               * Here it is used to set the visibility of message strip to false(hidden)
               **/

              this._destroyMsgStrip(false);
            },

            _handleRouteMatched: function(oEvt) {

              /**
               * @desc This it the event callback method that is registered for the handleRouteMatched event
               *       It triggers on every route match. Any data fetches/refreshes can be performed in this method
               * @param oEvt{object} referencing to the route matched event triggered via navigation
               */

              if (oEvt.getParameter("name") !== "mfinvlog") {
                return;
              }

              this.onRefresh();
              this._getAMCs();

            },

            _getAMCs: function() {

              /**
               * @desc This helper method is used to fetch all the AMC's from the database
               *       It calls the gateway helper method and gets a promise
               */

              var that = this;
              GatewayHelper.getAMCs().then(function(data) {
                that._getamcsuccess(data, that);
              }, function(err) {
                that._getamcfailure(err, that);
              });
            },

            _getamcsuccess: function(data, that) {
              /**
               * @desc This is a success event callback method for the get AMC's
               */
              // Set the data to AMC model
              var amcModel = this.getView().getModel("amc_model");
              amcModel.setData(data);
              amcModel.updateBindings();
            },
            _getamcfailure: function(err, that) {
              /**
               * @desc This is a failure event callback method for the get AMC's
               */
            },
            onFHChange: function(oEvt) {

              /**
               * @desc This is an event handler method of FundHouse name change. This picks the amc code
               *       for the selected Fund house
               */

              // Get the current selected key
              var amccode = oEvt.getParameter("selectedItem").getKey();
              this._amccode = amccode;
              this._getSchemes(amccode);
            },


            _getSchemes: function(amccode) {
              /**
               * @desc This helper method is used to fetch all the Schemes from the database
               *       It calls the gateway helper method and gets a promise
               */
              var that = this;
              GatewayHelper.getSchemes(amccode).then(function(data) {
                that._getschsuccess(data, that);
              }, function(err) {
                that._getschfailure(err, that);
              });

            },

            _getschsuccess: function(data, that) {

              /**
               * @desc This is a success event callback method for the get schemes
               */

              this._schdata = data;
              // Set the data to Scheme model
              var selschModel = this.getView().getModel("selSchModel");
              selschModel.setData([]);
              selschModel.setData(data);
              selschModel.updateBindings();

              this._showSchemesPopup(selschModel);

            },

            _showSchemesPopup: function(selschModel) {

              /**
               * @desc This is a helper method to show all the schemes retrieved as a pop-up
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
               * @desc This is a event handler method for search. It uses the search key and filters the table entries
               */

              var sValue = oEvent.getParameter("value");
              var oFilter = new sap.ui.model.Filter("sname", sap.ui.model.FilterOperator.Contains, sValue);

              var oBinding = oEvent.getSource().getBinding("items");
              oBinding.filter([oFilter]);
            },
            handleClose: function(oEvent) {

              /**
               * @desc This is an event handler method that handles the close event of the schemes pop-up. We
               *       can read the requisite data here based on what is selected in the pop-up
               */

              // Get all selected contexts
              var aContexts = oEvent.getParameter("selectedContexts");
              if (aContexts && aContexts.length) {

                // Get the mfname element and bind the selected fund to it
                var mfname = this.getView().byId("mfname");
                this._sname = aContexts.map(function(oContext) {
                  return oContext.getObject().sname;
                });
                mfname.setValue(this._sname);

                // Get the scode
                this._scode = aContexts.map(function(oContext) {
                  return oContext.getObject().scode;
                });
              }
              oEvent.getSource().getBinding("items").filter([]);
            },


            onSubmit: function(oEvt) {

              /**
               * @desc This is the callback for Submit button event. It retrieves all the data that is filled
               *       into the form, validates the same and does the appropriate error Handling
               *       If there are no errors then it submits the data to the database via a gateway helper method
               * @param oEvt{object} referencing to event object triggered
               */

              //Get the scode and investment date and perform an NAV Call
              var scode = this._scode[0];
              var invdate = this.getView().byId("mfinvdate").getValue();
              this._getNAVData(scode, invdate);


            },
            _getNAVData: function(scode, invdate) {

              /**
               * @desc This is a helper method to get the NAV Data for a given scheme and date combination.
               *       This uses the Gateway Helper method to get the NAV Data
               */

              var that = this;
              GatewayHelper.getNavData(scode, invdate).then(function(data) {
                that._navsuccess(data, that);
              }, function(err) {
                that._navfailure(err, that);
              });

            },

            _navsuccess: function(data, that) {

              /**
               * @desc This is a success event handler method for NAV retrieval
               */

              if (data.length > 0) {
                //NAV found, process to get other elements and validate
                var nav = data[0].nav;
                this._validateAndProcessData(nav, that);
              } else {
                // NAV not found, provide ownnav pop-up
                that._generateMsgStrip(that._geti18ntext("nonaverr"));
              }

            },
            _navfailure: function(data, that) {
              /**
               * @desc This is a error event handler method for NAV retrieval
               */
              that._generateMsgStrip(that._geti18ntext("nonaverr"));
            },

            _validateAndProcessData(nav, that) {

              /**
               * @desc This is a helper method that gets the data entered in the form and validates the same before psoting
               * @param nav representing the NAV for the selected scheme and date combination
               * @param that referring to the this attribute
               */

              var data = {};
              // Get transaction
              data.transaction = that.getView().byId("cbtran").getValue();
              // Get AMC Code
              data.amccode = that._amccode;
              // Get AMC Name
              data.amcname = that.getView().byId("cbfname").getValue();
              // Get Scheme Code
              data.scode = that._scode[0];
              // Get Fund Name
              data.sname = that.getView().byId("mfname").getValue();
              // Get Investment Date
              data.invdate = that.getView().byId("mfinvdate").getValue();

              // Get investment Amount
              data.amount = that.getView().byId("amntinv").getValue();
              if (data.transaction === "Sell") {
                data.amount = data.amount * -1;
              }

              // Get remarks
              data.remarks = that.getView().byId("remarks").getValue();
              // Get Investment For
              data.invFor = that.getView().byId("cbinvfor").getValue();
              // Get Asset type
              data.assetType = this.getView().byId("cbassettype").getValue();

              // Get investment for by using the loginuser information
              if (that._lgndata.user.name === "") {
                var lgnerrflg = 'X';

              } else {
                data.invBy = that._lgndata.user.name;

              }

              if (data.transaction === "" || data.amcname === "" || data.mfname === "" || data.invdate === "" || data.amntinv === "" || data.invfor === "" || data.assettype === "") {
                that._generateMsgStrip(that._geti18ntext("noformdet"));
              } else if (lgnerrflg === 'X') {
                lgnerrflg = '';
                that._generateMsgStrip(that._geti18ntext("lgnusererr"));
              } else {
                // NAV is always available, either from database or ownnav pop-up
                data.nav = nav;
                data.units = data.amount / data.nav;
                that._destroyMsgStrip(false);
                that._invrestcall(data, that);
              }
            },

            onRefresh: function() {

              /**
               * @desc This is a helper method to refresh the form and table.
               *       It is invoked when the page is loaded initially
               */

              this._destroyMsgStrip(false);
              this.getView().byId("cbtran").setValue("");
              this.getView().byId("cbfname").setValue("");
              this.getView().byId("mfname").setValue("");
              this.getView().byId("mfinvdate").setValue("");
              this.getView().byId("amntinv").setValue("");
              this.getView().byId("remarks").setValue("");
              this.getView().byId("cbinvfor").setValue("");
              this.getView().byId("cbassettype").setValue("");

              // Set the table binding to empty
              var mfinsmodel = this.getView().getModel("mfins_model");
              mfinsmodel.setData([]);
              mfinsmodel.updateBindings();

              // Collapse the table panel and Expand the input panel
              this.setPanelExpanded(this._invdetPanel, true);
              this.setPanelExpanded(this._invtabPanel, false);
            },

            _generateMsgStrip: function(msgtext, visible) {

              /**
               * @desc This renders the message strip on the view
               * @param msgtext referring to the message to be rendered
               * @param visible defining whether the message strip should be visible
               */

              if (this._oMessageStrip) {
                this._oMessageStrip.setVisible(visible);
                this._oMessageStrip.setText(msgtext);
              }

            },

            _destroyMsgStrip: function(visible) {

              /**
               * @desc This destroys the message strip on the view
               * @param visible defining whether the message strip should be visible
               */

              if (this._oMessageStrip) {
                this._oMessageStrip.setVisible(visible);

              }
            },
            _invrestcall: function(logdata, that) {

              /**
               * @desc This helper method is used to post the investment data to the database
               *       It calls the gateway helper method and gets a promise
               * @param logdata referring to the investment data to be logged to the database
               * @param that referring to this variable of the parent
               */

              // var that = this;
              GatewayHelper.postOneInvest(logdata).then(function(data) {
                that._invsuccess(data, that);
              }, function(err) {
                that._invfailure(err, that);
              });


            },
            _invsuccess: function(data, that) {

              /**
               * @desc This is the event handler success method.
               * @param data referring to the data that is inserted
               * @param that referring to the this variable of the parent
               */


              // Change date from ISODate format to normal date. We are using the Moment JS framewrok for this
              // data.operation.pdate = this._isodatetodate(data.operation.invdate);
              // var pdata = that._parseData(data, that);

              var pdata = ParsingHelpers._parsePostInvestment(data, that);
              var mfinsmodel = this.getView().getModel("mfins_model");
              mfinsmodel.setData(data);
              mfinsmodel.updateBindings();
              this.setPanelExpanded(this._invdetPanel, false);
              this.setPanelExpanded(this._invtabPanel, true);

            },
            _invfailure: function(err, that) {
              that._generateMsgStrip(that._geti18ntext("inverr"));
            },
          
            _getInvestFor: function(username) {
              /**
              * @desc This method will be called on the initialization of this view.
              *       It is used to fetch the Goals that are created for the particular user
              *       It performs an AJAX call and fetches the data
              *       If no data is found for the user, it uses generic goals

              * @param This receieves username as an input
              * @return This returns the values found for the user in the database(InvGoals collection)
              *         If nothing found then it returns the data for others

              */
              var that = this;
              GatewayHelper.getInvestFor(username).then(function(data) {
                that._goalsuccess(data, that);
              }, function(err) {
                that._goalfailure(err, that);
              });


            },

            _goalsuccess: function(data, that) {
              /**
               * @desc This is the success handler for Goals details.
               * If details are receieved then they are bound to the model, for display on the view
               * If no details are recieved, repeat the getInvestFor method with username as Others
               * @param data: data sent from the server
               * @param that: reference to the this variable of the view
               */
              if (data.length > 0) {
                var mfinvformodel = this.getView().getModel("mfinvfor_model");
                var assetdata = this.getView().getModel("mfasset_model").getData();
                var bindingdata = {};

                bindingdata.invFor = data; // Assign the goals data from server to invFor
                bindingdata.assetType = assetdata; // This is asset type data read from local models


                mfinvformodel.setData(bindingdata);
                mfinvformodel.updateBindings();
              } else // No data recieved, repeat the ajax request
              {
                that._getInvestFor("Others");
              }
            },
            _goalfailure: function(err, that) {
              that._generateMsgStrip(that._geti18ntext("goalerr"));
            },
            _getLoginData: function() {
              /**
               * @desc This provides the login user information.
               * Data retrieved is bound to a global variable of the view
               */

              // Since this is being invoked from init(), we get the model from Owner Component

              var loginuser = this.getOwnerComponent().getModel("loggedin_user");
              this._lgndata = loginuser.getData();

            },
            _launchOWNNAVPopup: function() {
              // create popover
              if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("simple_hello.view.ownnav", this);
                this.getView().addDependent(this._oPopover);

              }

              this._oPopover.attachAfterClose(this._oPopoverclose);

              // delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
              var odateinv = this.getView().byId("mfinvdate");
              jQuery.sap.delayedCall(0, this, function() {
                this._oPopover.openBy(odateinv);
              });
            },
            handleCancelPress: function() {
              this._oPopover.close();
              this._generateMsgStrip("Error fetching NAV. Please contact Admin")
            },
            handleSubmitPress: function() {
              var onavval = this.getView().byId("ownnavval");

            },
            _oPopoverclose: function(oEvt) {

            }

          });
    });
