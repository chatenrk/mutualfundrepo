/* global moment:true */
sap.ui
  .define(
    ["simple_hello/Controller/BaseController",
      "../helpers/GatewayHelper",
      "../helpers/ParsingHelpers",
      "../helpers/OtherHelpers",
      "../helpers/DateHelpers",
      "simple_hello/libs/Toastr"
    ],
    function(BaseController, GatewayHelper, ParsingHelpers, OtherHelpers, DateHelpers, Toastr) {
      "use strict";
      var _oRouter;
      return BaseController
        .extend(
          "simple_hello.Controller.schdetails", {

            onInit: function() {

              this._oRouter = this.getRouter();
              this._oRouter.attachRouteMatched(this._handleRouteMatched, this);
            },

            _handleRouteMatched: function(oEvt) {

              /**
               * @desc This is the event callback for the attachRouteMatched event. It listens to the event and
               *       triggers whenever there is a route match
               * @param oEvt: Reference to the route matched event
               */

              // Check if the route matched is the Scheme details
              if (oEvt.getParameter("name") !== "schdet") {
                return;
              }

              // During routing a query parameter is passed. Get the fields that are passed
              var oArgs = oEvt.getParameter("arguments"),
                data = oArgs["?query"];

              // Get Scheme details
              if (data.scode !== "") {
                this._getSchDet(data.scode);
              }

              //Query and get the data
              if (data.scode !== "" &&
                data.invBy !== "" &&
                data.invFor !== "") {
                this._getInvData(data.scode, data.invBy, data.invFor);
              }
            },
            _getSchDet: function(scode) {
              /**
               * @desc This method invokes the gateway helper to retrieve the Scheme details
               * It uses the scheme code to fetch the data
               * @param scode: scheme code of the selected scheme
               */

              var that = this;
              GatewayHelper._getSchemeDetails(scode).then(function(data) {
                that._getSchDetSuccess(data, that);
              }, function(err) {
                that._getSchDetFailure(err, that);
              });

            },
            _getSchDetSuccess: function(data, that) {

              var oJSONModel = this.getOwnerComponent().getModel("schdet_model");
              if (data.length > 0) {
                var parseData = ParsingHelpers._parseSchDetails(data);
                oJSONModel.setData(parseData[0]);
                oJSONModel.updateBindings();
              } else {
                oJSONModel.setData([]);
              }
            },
            _getSchDetFailure: function(err, that) {

            },

            _getInvData: function(scode, invBy, invFor) {
              /**
               * @desc This method invokes the gateway helper to retrieve the investment details
               * It uses the scheme code, invested By and Goal details to fetch the investment
               * @param scode: scheme code of the selected scheme
               * @param invBy: User for the investment
               * @param: invFor: Goal of the selected investment
               */

              var that = this;
              that.scode = scode;
              that.invBy = invBy;
              that.invFor = invFor;
              var desctrue = true; // Descending Order of investments

              //  Call the gateway helper method to get individual investments for selected scheme
              GatewayHelper._getInvBySchCodeInvFor(scode, invBy, invFor, desctrue).then(function(data) {
                that._getinvsuccess(data, that);
              }, function(err) {
                that._getinvfailure(err, that);
              });





            },
            _getcurrvalsuccess: function(data, cvaldata, that) {

              var schinvaggr_model = that.getOwnerComponent().getModel("schinvaggr_model");

              var schdata = {};
              var desctrue = true; // Descending Order of investments

              schdata.totalVal = OtherHelpers._formatCurrency(data.totinv);
              schdata.numInv = data.invcount;
              schdata.totalUnits = data.totalunits;
              schdata.currdate = DateHelpers._currentDate();

              schdata.currVal = OtherHelpers._formatCurrency(Math.round(cvaldata.currvalamnt));
              schdata.lnavDate = cvaldata.lastNavDate;

              schinvaggr_model.setData([]);
              schinvaggr_model.setData(schdata);
              schinvaggr_model.updateBindings();



            },

            _getinvsuccess: function(data, that) {

              if (data.length > 0) {


                var parseData = ParsingHelpers._parseInvDetails(data);
                var oJSONModel = this.getOwnerComponent().getModel("dispinvdetl");
                oJSONModel.setData(parseData);
                oJSONModel.updateBindings();

                // Now that we have the individual investments get the total investment and current value
                // Get the total and count of investments(from the previous page)
                var oAggrModel = this.getOwnerComponent().getModel("manageinv_model");
                var data = oAggrModel.getData();

                for (var i = 0; i < data.length; i++) {
                  if (data[i].scode === parseInt(that.scode) && data[i].invFor === that.invFor) {
                    that.schaggrdata = data[i];
                    // Perform the gateway call and get the current value of the investment selected
                    GatewayHelper.getCurrentValue(data[i].scode, data[i].totalunits).then(function(cvaldata) {
                      that._getcurrvalsuccess(that.schaggrdata, cvaldata, that);
                    }, function(err) {
                      that._getcurrvalfailure(err, that);
                    });

                  }
                }

              } else {

              }

            },
            _getinvfailure: function(err, that) {

            },


            handleSchLinkPressed: function(oEvent) {
              var data = this.getView().getModel("schdet_model").getData();
              var url = data.schurl;
              sap.m.URLHelper.redirect(url, true);
            },
            formatData: function(data) {
              // Format currency
              data.assets = this.formatCurrency(data.assets) +
                " " +
                data.assetqual + " " + data.assetcurr;

            },
            handlePopOverPress: function(oEvt) {
              this._showpopover("display", oEvt);
            },

            _showpopover: function(type, oEvt) {
              if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("investpopover", "simple_hello.view.invpopover", this);
                this.getView().addDependent(this._oPopover);
                this._oPopover.attachAfterOpen(function() {
                  this.disablePointerEvents();
                }, this);
                this._oPopover.attachAfterClose(function() {
                  this.enablePointerEvents();
                }, this);
              }

              this._svbutton = Fragment.byId("investpopover", "save");
              this._cpybutton = Fragment.byId("investpopover", "copy");
              this._delbutton = Fragment.byId("investpopover", "delete");
              this._editbutton = Fragment.byId("investpopover", "edit");

              if (type === "display") {
                // Get the content from the invdetl fragment and add it to the popover
                if (!this._invdetl) {
                  this._invdetl = sap.ui.xmlfragment("investdetl", "simple_hello.view.invdetl", this);
                }

                var popoverContent = Fragment.byId("investdetl", "invdeltdispVBOX");

                //remove all content
                this._oPopover.removeAllContent();
                this._oPopover.insertContent(popoverContent);

                this._editbutton.setVisible(true);
                this._cpybutton.setVisible(true);
                this._delbutton.setVisible(true);
                this._svbutton.setVisible(false);
              }

              // delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
              var oControl = oEvt.getSource();
              this._oPopover.openBy(oControl);

              
            }





          });
    });
