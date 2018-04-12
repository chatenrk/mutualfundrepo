/* global moment:true */
sap.ui
  .define(
    ["simple_hello/Controller/BaseController",
      "sap/m/MessageToast",
      "sap/m/UploadCollectionParameter",
      "../utils/helpers",
      "simple_hello/libs/Moment",
      "sap/ui/core/util/Export",
      "sap/ui/core/util/ExportTypeCSV"
    ],
    function(BaseController, MessageToast, UploadCollectionParameter, Helpers, Moment, Export, ExportTypeCSV) {
      "use strict";
      var postdata, _fPanel, _tPanel;
      return BaseController
        .extend(
          "simple_hello.Controller.addmultnav", {
            onInit: function() {

              /**
               * @desc This is a lifecycle hook method that is called when the view is initialized
               * Useful for initialization of the any parameters, adding dependent event handlers etc
               * Here it is used to subscribe to the handleRouteMatched event of the router
               *
               */

              var oRouter = this.getRouter();
              oRouter.attachRouteMatched(this._handleRouteMatched, this);



              //
              // // Set the collection for Filter List
              // var oFilterList = {
              //
              // };

            },

            _handleRouteMatched: function(oEvt) {

              /**
               * @desc This it the event callback method that is registered for the handleRouteMatched event
               *       It triggers on every route match. Any data fetches/refreshes can be performed in this method
               * @param oEvt{object} referencing to the route matched event triggered via navigation
               */

              if (oEvt.getParameter("name") !== "addmultnav") {
                return;

              }

              this._handleRefreshOnRouting();
            },

            _handleRefreshOnRouting: function() {

              /**
               * @desc This is a helper method that performs the refresh and toggle of the panels on routing
               *       It toggles the file panel to expanded,and the table panel to collapsed
               *       It also refreshes the file panel upload file name and sets the table contents to empty
               */

               this._fPanel = this.getView().byId("filePanel");
               this._fPanel.setExpandable(true);
               this._fPanel.setExpanded(true);

               this._tPanel = this.getView().byId("tablePanel");
               this._tPanel.setExpandable(true);
               this._tPanel.setExpanded(false);

               // Remove the value of the file name field
               this.getView().byId("idfileUploader").setValue("");

               // Set the table data to empty
               var pnav_model = this.getOwnerComponent().getModel("post_nav_model");
               pnav_model.setData([]);
               pnav_model.updateBindings();

               // Set the collection for Filter List
               var oFilterList = {

               };

             },

            onFileDeleted: function(oEvent) {
              MessageToast.show("Event fileDeleted triggered");
            },

            onFilenameLengthExceed: function(oEvent) {
              MessageToast.show("Event filenameLengthExceed triggered");
            },

            onFileSizeExceed: function(oEvent) {
              MessageToast.show("Event fileSizeExceed triggered");
            },

            onTypeMissmatch: function(oEvent) {
              MessageToast.show("Please upload only .TXT files");
            },
            onStartUpload: function(oEvent) {
              var oUploadCollection = this.getView().byId("UploadCollection");
              // var oTextArea = this.getView().byId("TextArea");
              var cFiles = oUploadCollection.getItems().length;
              var uploadInfo = "";

              oUploadCollection.upload();

              uploadInfo = cFiles + " file(s)";

              MessageToast.show("Method Upload is called (" + uploadInfo + ")");
              sap.m.MessageBox.information("Uploaded " + uploadInfo);

            },
            onUploadComplete: function(oEvent) {
              var sUploadedFiles = oEvent.getParameter("files");
              for (var i = 0; i < sUploadedFiles.length; i++) {
                console.log(sUploadedFiles[i].fileName);
              }
            }


          }); // Controller extend end
    }); // Main function end
