sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast","sap/m/UploadCollectionParameter","../utils/helpers" ],
                function(BaseController, MessageToast,UploadCollectionParameter,Helpers) {
                    "use strict";
                    var postdata,_fPanel,_tPanel;
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.addschemes",
                                    {
                                        onInit : function() 
                                        {
                                        	
                                        	this._fPanel = this.getView().byId("filePanel");
                                        	this._fPanel.setExpandable(true);
                                        	this._fPanel.setExpanded(true);
                                        	
                                        	this._tPanel = this.getView().byId("tablePanel");
                                        	this._tPanel.setExpandable(true);
                                        	this._tPanel.setExpanded(false);
                                        	
//                                        	var visdata = {
//                                        			isFUPanelExpanded:true,
//                                        			isUSPanelExpanded:false
//                                        	}
//                                          var vismodel = this.getOwnerComponent().getModel("vis_model");	
//                                          vismodel.setData(visdata);
////                                          this._vismodel.updateBindings();
////                                          this.getView().setModel("vismodel",vismodel);
                                        },
                                       
                                		onStartUpload : function(oEvent) 
                                		{
                                			var fU = this.getView().byId("idfileUploader");
                                			var domRef = fU.getFocusDomRef();
                                			var file = domRef.files[0];
                                			this._schemerestcall(file)
                           					
                                		},
                                		
                                		 _schemerestcall:function(file)
                                         {
                                			 
                                			// instantiate dialog
                                 			if (!this._dialog) 
                                 			{
                                 				this._dialog = sap.ui.xmlfragment("simple_hello.view.busydialog", this);
                                 				this.getView().addDependent(this._dialog);
                                 			}
                                 			
                                 			// open dialog
                                 			var oJSONModel = this.getJSONModel();
                                 			var data = {
                                 					title:"Post Scheme Data",
                                 					text:"Posting the scheme data to database. Please wait"
                                 			}
                                 			
                                 			oJSONModel.setData(data);
                                 			this.getView().setModel(oJSONModel,"busyDialog");
                                 			
                                 			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
                                 			this._dialog.open(); 
                                			 
                                        	var authurl = "http://localhost:3000/schemes/csv";
                                			var that = this;
                                			
                                			var fd = new FormData();
                                		    fd.append('file', file);
                                			
                                			$.ajax(
                                				      {
                                				        url:authurl,
                                				        processData: false, // important
                                				        contentType: false, // important
                                				        data:fd,
                                				        type: 'POST',
                                				        cache:false,
                                				       
                                				        
                                				        success:function(data)
                                				        {
                                				        	that._postschsuccess(data,that);
                                				       
                                				        },
                                				        error:function(err)
                                				        {
                                				        	that._postschfailure(err,that);
                                				       
                                				        }
                                			
                                				      });			//AJAX call close	
                                         },
                                         
                                         _postschsuccess:function(data,that)
                                         {
                                        	 // Close the busy dialog
                                        	 if(that._dialog)
                                        	 {
                                        		 that._dialog.close();
                                        	 }
                                        	 
                                        	 this._fPanel.setExpanded(false);
                                        	 this._tPanel.setExpanded(true);

                                        	 // Add the data to model
                                        	 
                                        	 var parseData = that.parseSuccessData(data);
                                        	 var pscheme_model = that.getView().getModel("post_scheme_model");
                                        	 pscheme_model.setData(parseData);
                                         },
                                         _postschfailure:function(err,that)
                                         {
                                        	 // Close the busy dialog
                                        	 if(that._dialog)
                                        	 {
                                        		 that._dialog.close();
                                        	 } 
                                         },
                                         parseSuccessData:function(data)
                                         {
                                        	 var parseData = {};
                                        	 var pdata = [];
                                        	 var dupkeyerr = "duplicate key error";
                                        	 var errmsg = "Data already exists in database. No operation performed";
                                        	 var succmsg = "Data inserted successfully into database";	 
                                        	 for (var i = 0; i < data.length; i++) 
                                        	 { 
                                        		  // perform required array operations
                                        		 
                                        		 if(data[i].opsuccess === false)
                                        		 {
                                        			 // Error during insertion
                                        			 if(data[i].message.includes(dupkeyerr))
                                        			 {
                                        				 // Record already exists in DB
                                        				 parseData.scode = data[i].operation.scode;
                                        				 parseData.sname = data[i].operation.sname;
                                        				 parseData.msg = errmsg;
                                        				 pdata.push(parseData);
                                        				 parseData = {};
                                        			 }
                                        		 }
                                        		 else
                                        		 {
                                        			 // Successfully inserted into DB
                                        			
                                    				 parseData.scode = data[i].operation.scode;
                                    				 parseData.sname = data[i].operation.sname;
                                    				 parseData.msg = succmsg;
                                    				 pdata.push(parseData);
                                    				 parseData = {};
                                        		 }
                                        	 }
                                        	 return pdata;
                                         }

 
                                    });
                });