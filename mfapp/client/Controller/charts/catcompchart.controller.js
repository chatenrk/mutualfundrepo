sap.ui
  .define(
    ["simple_hello/Controller/BaseController",
      "../../helpers/GatewayHelper",
      "../../helpers/ParsingHelpers"
    ],
    function(BaseController, GatewayHelper, ParsingHelpers) {
      "use strict";
      var _oRouter;
      return BaseController
        .extend(
          "simple_hello.Controller.charts.catcompchart", {


            onInit: function() {
              /**
               * @desc This is a lifecycle hook method that is called when the view is initialized
               * Useful for initialization of the any parameters, adding dependent event handlers etc
               * Here it is used to subscribe to the handleRouteMatched event of the router
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

              if (oEvt.getParameter("name") !== "catcompchart") {
                return;

              }

              this._getCategoryDropdown();
            },

            _getCategoryDropdown: function() {
              /**
               * @desc This gets all scheme categories that are to be displayed in the dropdown
               */
              var that = this;
              GatewayHelper._getprojcatandfunds().then(function(data) {
                that._getprojcatandfundssuccess(data, that);
              }, function(err) {
                that._getprojcatandfundsfailure(err, that);
              });
            },

            _getprojcatandfundssuccess: function(data, that) {

              var schcatarr = [],
                schcatobj = {},
                schtypename = [],
                schtypeobj = {},
                schtypenameobj = {};

              for (var i = 0; i < data.length; i++) {
                if (ParsingHelpers.checkStringInArray(schcatarr, "schcat", data[i].schcat) === false) //Projection category not present in array
                {
                  schcatobj.schcat = data[i].schcat;
                  schcatarr.push(schcatobj);
                  schcatobj = {};
                }
              }

              var schcatmodel = this.getView().getModel("chtschcat_model");
              schcatmodel.setData([]);
              schcatmodel.setData(schcatarr);
              schcatmodel.updateBindings();
              schcatarr = [];

            },

            _getprojcatandfundsfailure: function(err, that) {},

            onSelectChtSchCat: function(oEvt) {
              /**
               * @desc This is an event handler method of Scheme Category. This gets the selected scheme category
               */

              // Get the current selected key
              var selschcat = oEvt.getParameter("selectedItem").getKey();

              // Get the fund data based on the selected category
              this._getFundProjData(selschcat);
            },
            _getFundProjData:function(selschcat){
              
            }





          });
    });
