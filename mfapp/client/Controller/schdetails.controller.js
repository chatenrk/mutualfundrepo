/* global moment:true */
sap.ui
  .define(
    ["simple_hello/Controller/BaseController",
      "../helpers/GatewayHelper",
      "../helpers/ParsingHelpers",
      "simple_hello/libs/Toastr"
    ],
    function(BaseController, GatewayHelper, ParsingHelpers, Toastr) {
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
              var desctrue = true; // Descending Order of investments

              // // Get the total and count of investments(from the previous page)
              // var oAggrModel = this.getOwnerComponent().getModel("manageinv_model");
              // var data = oAggrModel.getData();
              //
              // for (var i = 0; i < data.length; i++) {
              //   if (data[i].scode === parseInt(scode) && data[i].invFor === invFor) {
              //     var schdet_model = this.getOwnerComponent().getModel("schdet_model");
              //
              //     var schdata = schdet_model.getData();
              //     schdata.totalVal = data[i].total;
              //     schdata.numInv = data[i].count;
              //
              //     schdet_model.setData([]);
              //     schdet_model.setData(schdata);
              //     schdet_model.updateBindings();
              //   }
              // }

              GatewayHelper._getInvBySchCodeInvFor(scode, invBy, invFor, desctrue).then(function(data) {
                that._getinvsuccess(data, that);
              }, function(err) {
                that._getinvfailure(err, that);
              });

            },

            _getinvsuccess: function(data, that) {

              if (data.length > 0) {


                var parseData = ParsingHelpers._parseInvDetails(data);
                var oJSONModel = this.getOwnerComponent().getModel("dispinvdetl");
                oJSONModel.setData(parseData);
                oJSONModel.updateBindings();
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

            }



          });
    });
