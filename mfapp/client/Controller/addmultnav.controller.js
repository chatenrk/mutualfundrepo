/* global moment:true */
sap.ui
        .define(
                [ "simple_hello/Controller/BaseController",
                  "sap/m/MessageToast",
                  "sap/m/UploadCollectionParameter",
                  "../utils/helpers",
                  "simple_hello/libs/Moment",
                  "sap/ui/core/util/Export",
          		  "sap/ui/core/util/ExportTypeCSV"],
                function(BaseController, MessageToast,UploadCollectionParameter,Helpers,Moment,Export, ExportTypeCSV) {
                    "use strict";
                    var postdata,_fPanel,_tPanel;
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.addmultnav",
                                    {
                                        onInit : function()
                                        {

                                        	this._fPanel = this.getView().byId("filePanel");
                                        	this._fPanel.setExpandable(true);
                                        	this._fPanel.setExpanded(true);

                                        	this._tPanel = this.getView().byId("tablePanel");
                                        	this._tPanel.setExpandable(true);
                                        	this._tPanel.setExpanded(false);

                                        	// Set the collection for Filter List
                                        	var oFilterList = {

                                        	};

                                        },
                                        onFileDeleted : function(oEvent)
                                        {
                                          MessageToast.show("Event fileDeleted triggered");
                                        },

                                       onFilenameLengthExceed : function(oEvent)
                                       {
                                         MessageToast.show("Event filenameLengthExceed triggered");
                                       },

                                       onFileSizeExceed : function(oEvent)
                                       {
                                         MessageToast.show("Event fileSizeExceed triggered");
                                       },

                                       onTypeMissmatch : function(oEvent)
                                       {
                                         MessageToast.show("Please upload only .TXT files");
                                       },
                                       onStartUpload : function(oEvent)
                                       {
			                                      var oUploadCollection = this.getView().byId("UploadCollection");
			                                      // var oTextArea = this.getView().byId("TextArea");
			                                      var cFiles = oUploadCollection.getItems().length;
			                                      var uploadInfo = "";

			                                      oUploadCollection.upload();

			                                      uploadInfo = cFiles + " file(s)";

			                                      MessageToast.show("Method Upload is called (" + uploadInfo + ")");
			                                      sap.m.MessageBox.information("Uploaded " + uploadInfo);

		                                    },
                                        onUploadComplete : function(oEvent)
                                        {
                                          	var sUploadedFiles = oEvent.getParameter("files");
                                            for(var i=0;i<sUploadedFiles.length;i++)
                                            {
                                              console.log(sUploadedFiles[i].fileName);
                                            }
                                        }


                                    });							// Controller extend end
                });												// Main function end
