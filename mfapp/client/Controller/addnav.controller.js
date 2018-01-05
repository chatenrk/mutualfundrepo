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
                                    "simple_hello.Controller.addnav",
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
                                       
                                		onStartUpload : function(oEvent) 
                                		{
                                			var fU = this.getView().byId("idfileUploader");
                                			var domRef = fU.getFocusDomRef();
                                			var file = domRef.files[0];
                                			this._navrestcall(file)
                           					
                                		},
                                		
                                		 _navrestcall:function(file)
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
                                 					title:"Post NAV Data",
                                 					text:"Posting the NAV data to database. Please wait"
                                 			}
                                 			
                                 			oJSONModel.setData(data);
                                 			this.getView().setModel(oJSONModel,"busyDialog");
                                 			
                                 			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
                                 			this._dialog.open(); 
                                			 
                                        	var authurl = "http://localhost:3000/nav/csv";
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
                                				        	that._postnavsuccess(data,that);
                                				       
                                				        },
                                				        error:function(err)
                                				        {
                                				        	that._postnavfailure(err,that);
                                				       
                                				        }
                                			
                                				      });			//AJAX call close	
                                         },
                                         
                                         _postnavsuccess:function(data,that)
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
                                        	
                                        	 
                                        	 // Set data for the table
                                        	 var pnav_model = that.getView().getModel("post_nav_model");
                                        	 pnav_model.setData(parseData);
                                        	 
                                        	 if(parseData.length>50)
                                        	 {
                                        		 MessageToast.show(parseData.length + " records processed.Please use download functionality to check posting info in detail")
                                        	 }
                                        	 else
                                        	 {
                                        		 MessageToast.show(parseData.length + " records processed");
                                        	 }
                                        	 
                                        	
                                         },
                                         _postnavfailure:function(err,that)
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
                                        				 parseData.nav = data[i].operation.nav;
                                        				 
                                        				 
                                        				 // Convert date to DD-MM-YYYY format
                                        				 var pdate = moment(data[i].operation.date).utcOffset("+05:30").format('DD-MMM-YYYY');
                                        				 parseData.date = pdate;
                                        				 

//                                        				 parseData.date = data[i].operation.date;
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
                                    				 parseData.nav = data[i].operation.nav;
                                    				 
                                    				 
                                    				 // Convert date to DD-MM-YYYY format
                                    				 var pdate = moment(data[i].operation.date).utcOffset("+05:30").format('DD-MMM-YYYY');
                                    				 parseData.date = pdate;
                                    				
                                    				 
                                    				 
                                    				 parseData.msg = succmsg;
                                    				 pdata.push(parseData);
                                    				 parseData = {};
                                    				 
                                    			
                                        		 }
                                        	 }
                                        	 return pdata;
                                         },
                                     	
                                         onDataExport : sap.m.Table.prototype.exportData || function(oEvent) 
                                         {
                                        		var oExport = new Export(
                                        				{
                                        			
                                        					// Type that will be used to generate the content. Own ExportType's can be created to support other formats
                                        					exportType : new ExportTypeCSV(
                                        							{
                                        								separatorChar : ";"
                                        							}),
                                        							
                                        					// Pass in the model created above
                                        					models : this.getView().getModel("post_nav_model"),
                                        					
                                        					// binding information for the rows aggregation
                                        					rows : 
                                        					{
                                        						path : "/"
                                        					},
                                        					
                                        					// column definitions with column name and binding info for the content

                                        					columns : [
                                        					{
                                        						name : "Scheme Code",
                                        						template : 
                                        						{
                                        							content : "{scode}"
                                        						}
                                        					}, 
                                        					{
                                        						name : "Scheme Name",
                                        						template : 
                                        						{
                                        							content : "{sname}"
                                        						}
                                        					}, 
                                        					{
                                        						name : "NAV",
                                        						template : 
                                        						{
                                        							content : "{nav}"
                                        						}
                                        					}, 
                                        					{
                                        						name : "Date",
                                        						template : 
                                        						{
                                        							content : "{date}"
                                        						}
                                        					}, 
                                        					{
                                        						name : "Posting Message",
                                        						template : 
                                        						{
                                        							content : "{msg}"
                                        						}
                                        					}]  // Columns end
                                        				});		// Export end
                                        		
                                        		// download exported file
                                    			oExport.saveFile().catch(function(oError) 
                                    			{
                                    				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
                                    			}).then(function() 
                                    			{
                                    				oExport.destroy();
                                    			});
                                        		
                                        		
                                         }						// Data Export Function end
                                        
 
                                    });							// Controller extend end
                });												// Main function end