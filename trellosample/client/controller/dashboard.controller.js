sap.ui
  .define(
    ["trello_sample/controller/BaseController","../helpers/ajaxcallhelpers"],
    function(BaseController,AjaxCallHelpers) {
      "use strict";
      var self;
      return BaseController
        .extend(
          "trello_sample.controller.dashboard", {
            onInit: function() {
              self = this;
              //Get all the Trello dashboards for a user
              AjaxCallHelpers._getAllDashboards("crayabharam").then(function(data){
                //Bind the boards data to the model for display
                var oBoardsModel = self.getOwnerComponent().getModel("boards_model");
                oBoardsModel.setData([]);
                oBoardsModel.setData(data);
                oBoardsModel.updateBindings();
              },function(err){

              });

            }
          });
    });
