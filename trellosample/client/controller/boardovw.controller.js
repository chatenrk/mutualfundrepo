sap.ui
  .define(
    ["trello_sample/controller/BaseController", "../helpers/ajaxcallhelpers"],
    function(BaseController, AjaxCallHelpers) {
      "use strict";
      var self, oRouter;
      return BaseController
        .extend(
          "trello_sample.controller.boardovw", {
            onInit: function() {
              self = this;
              oRouter = this.getRouter(); //This method is invoked from BaseController class

              // Define a event handler method for RouteMatched method
              oRouter.attachRouteMatched(this._handleRouteMatched, this);

            },
            _handleRouteMatched: function(oEvt) {
              // If the route name does not match with current route, return
              if (oEvt.getParameter("name") !== "boardovw") {
                return;
              }

              // Get the context parameter
              var param = oEvt.getParameter("arguments").param;
            }
          });
    });
