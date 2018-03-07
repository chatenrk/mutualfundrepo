sap.ui
  .define(
    ["simple_hello/Controller/BaseController",
      "../helpers/GatewayHelper"
    ],
    function(BaseController, GatewayHelper) {
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

              //Query and get the data
              if (data.scode !== "" &&
                data.invBy !== "" &&
                data.invFor !== "") {
                this._getSchData(data.scode, data.invBy, data.invFor);
              }
            },
            _getSchData: function(scode, invBy, invFor) {
              /**
               * @desc This method invokes the gateway helper to retrieve the investment details
               * It uses the scheme code, invested By and Goal details to fetch the investment
               * @param scode: scheme code of the selected scheme
               * @param invBy: User for the investment
               * @param: invFor: Goal of the selected investment
               */
              var that = this;
              GatewayHelper._getInvBySchCodeInvFor(scode, invBy, invFor).then(function(data) {
                that._getinvsuccess(data, that);
              }, function(err) {
                that._getinvfailure(err, that);
              });

            },

            _getinvsuccess: function(data, that) {

              var parseData = this._parseData(data);
              

            },
            _getinvfailure: function(err, that) {

            },
            _parseData:function(data)
            {
              var pobj = {},parr = [];
              for (var i = 0; i < data.length; i++) {
                pobj = data[i];
                pobj.invdatefmtd = this._isodatetodate(data[i].invdate);
                parr.push(pobj);
                pobj = {};
              }
              return parr;
            }
            // _schdetrestcall: function() {
            //   var authurl = "http://localhost:3000/schemes/sdet" + "?scode=" + this.scode;
            //   var that = this;
            //
            //   $.ajax({
            //     url: authurl,
            //     type: 'GET',
            //     dataType: 'json',
            //     success: function(data) {
            //       that._getschsuccess(data, that);
            //
            //     },
            //     error: function(err) {
            //       that._getschfailure(err, that);
            //
            //     }
            //
            //   }); //AJAX call close
            // },

            // _getschsuccess: function(data, that) {
            //
            //   // Format data
            //   var formattedData = that.formatData(data[0])
            //   // Bind data to the model
            //   var oModel = that.getView().getModel("schdet_model");
            //
            //   oModel.setData([]);
            //   oModel.setData(data[0]);
            //   //                                        	oModel.refresh();
            //
            //   //                                        	this.getView().byId("objpghdr").bindElement("schdet_model");
            //
            // },
            // _getschfailure: function(err, that) {
            //
            // },
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
            formatCurrency: function(curr) {
              var x = curr.toString();
              var lastThree = x.substring(x.length - 3);
              var otherNumbers = x.substring(0, x.length - 3);
              if (otherNumbers != '')
                lastThree = ',' + lastThree;
              return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            }



          });
    });
