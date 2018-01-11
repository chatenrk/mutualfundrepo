sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast", 'sap/m/Popover','sap/m/Button',
                	'sap/m/MessageStrip','sap/m/MessageToast','sap/ui/model/Filter'],
                function(BaseController, MessageToast,Popover,Button,MessageStrip,Filter) {
                    "use strict";
                    
                    var _oStorage,_oMessageStrip,_amcdata,_scode,_sname;
                    
                    jQuery.sap.require("jquery.sap.storage");
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.mfinvlog",
                                    {
                                    			
                                    
                                        onInit : function() 
                                        {
                                        	this._oMessageStrip = this.getView().byId("msgstrp");
                                        	var oRouter = this.getRouter();
                                        	oRouter.attachRouteMatched(this._handleRouteMatched, this);
                                        	this.oSF = this.getView().byId("searchField");
                                        },
                                    	onExit : function () 
                                    	{
                                			if (this._oDialog) 
                                			{
                                				this._oDialog.destroy();
                                			}
                                		},
                                        
                                        _handleRouteMatched:function(oEvt)
                                        {
                                        	 if (oEvt.getParameter("name") !== "mfinvlog") {
                                        		 
                                                 return;
 
                                             } 
                                        	 
                                        	 this._getAMCs();
                                        	 
                                        },
                                        
                                        _getAMCs:function(){
                                        	
                                        	var authurl = "http://localhost:3000/amc/all";
                                			var that = this;
                                			
                                			$.ajax(
                                				      {
                                				        url:authurl,
                                				        type: 'GET',
                                				        dataType:'json',
                                				        success:function(data)
                                				        {
                                				        	that._getamcsuccess(data,that);
                                				       
                                				        },
                                				        error:function(err)
                                				        {
                                				         that._getamcfailure(err,that);
                                				       
                                				        }
                                			
                                				      });			//AJAX call close	

                                        },
                                        
                                        _getamcsuccess: function(data,that){
                                       	  
                                        	this._amcdata = data;
                                        	
                                       	 // Set the data to AMC model
                                       	var amcModel =  this.getView().getModel("amc_model");
                                       	amcModel.setData(data);
                                       	amcModel.updateBindings();
                                        },
                                        _getamcfailure:function(err,that)
                                        {
                                        },
                                        onFHChange:function(oEvt){
                                        	// Get the current selected key
                                           var amccode = oEvt.getParameter("selectedItem").getKey();
                                          this._getSchemes(amccode);
                                        },
                                        
                                        
                                        _getSchemes:function(amccode)
                                        {
                                        	var authurl = "http://localhost:3000/schemes/sdet/amc";
                                			var that = this;
                                			
                                			var data = {
                                						amccode:amccode
                                						};
                                			
                                			$.ajax(
                              				      {
                              				        url:authurl,
                              				        type: 'GET',
                              				        data:data,
                              				        dataType:'json',
                              				        success:function(data)
                              				        {
                              				        	that._getschsuccess(data,that);
                              				       
                              				        },
                              				        error:function(err)
                              				        {
                              				         that._getschfailure(err,that);
                              				       
                              				        }
                              			
                              				      });			//AJAX call close	
                                			
                                        },
                                        
                                        _getschsuccess:function(data,that)
                                        {
                                        	 // Set the data to Scheme model
                                           	var selschModel =  this.getView().getModel("selSchModel");
                                           	selschModel.setData([]);
                                           	selschModel.setData(data);
                                           	selschModel.updateBindings();
                                           	
                                           	this._showSchemesPopup(selschModel);
                                           	
                                        },
                                        
                                        _showSchemesPopup:function(selschModel){
                                        	
                                        	if (!this._oDialog) {
                                				this._oDialog = sap.ui.xmlfragment("simple_hello.view.schemeselect", this);
//                                				this.getView().addDependent(this._oDialog);
                                			}
                                        	
                                        	this._oDialog.setModel(null,"selschModel");
                                        	this._oDialog.setModel(selschModel,"selschModel");
                                			
                                			// toggle compact style
                                			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
                                			this._oDialog.open();
                                        	
                                        },
                                        
                                        handleSearch: function(oEvent) {
                                			var sValue = oEvent.getParameter("value");
                                			var oFilter = new sap.ui.model.Filter("sname", sap.ui.model.FilterOperator.Contains, sValue);
                                			
                                			var oBinding = oEvent.getSource().getBinding("items");
                                			oBinding.filter([oFilter]);
                                		},
                                		handleClose: function(oEvent) {
                                			var aContexts = oEvent.getParameter("selectedContexts");
                                			if (aContexts && aContexts.length) 
                                			{
                                				var mfname = this.getView().byId("mfname");
                                				this._sname = aContexts.map(function(oContext) { return oContext.getObject().sname; });
                                				mfname.setValue(this._sname);
                                				this._scode = aContexts.map(function(oContext) { return oContext.getObject().scode; });
                                			}
                                			oEvent.getSource().getBinding("items").filter([]);
                                		},
                                        onBeforeRendering:function()
                                        {
                                        	this._destroyMsgStrip(false);
                                        },
                                        
                                        onSubmit: function(oEvt){
                                        	
                                        	var data = {};
                                        	data.amcname = this.getView().byId("cbfname").getValue();
                                    		data.mfname = this.getView().byId("mfname").getValue();
                                    		data.invdate = this.getView().byId("mfinvdate").getValue();
                                    		data.amntinv = this.getView().byId("amntinv").getValue();
                                    		data.remarks = this.getView().byId("remarks").getValue();
                                    		data.invfor = this.getView().byId("cbinvfor").getValue();
                                    		data.assettype = this.getView().byId("cbassettype").getValue();
                                    		
                                    		//Retrieve NAV according to date and scode
                                        	 
                                        	if (data.amcname === "" || data.mfname === "" ||data.invdate === ""||data.amntinv === ""||data.invfor === ""||data.assettype === "")
                                        	{
                                        		this._generateMsgStrip("Please provide all the details on the form");
                                        	}
                                        	else
                                        	{
                                        		this._destroyMsgStrip(false);
//                                        		this._loginrestcall(data);
                                        	}
                                        	
                                        },
                                        onRefresh: function()
                                        {
                                        	this._destroyMsgStrip(false);
                                        	this.getView().byId("cbfname").setValue("");
                                    		this.getView().byId("mfname").setValue("");
                                    		this.getView().byId("mfinvdate").setValue("");
                                    		this.getView().byId("amntinv").setValue("");
                                    		this.getView().byId("remarks").setValue("");
                                    		this.getView().byId("cbinvfor").setValue("");
                                    		this.getView().byId("cbassettype").setValue("");
                                        },
                                       
                                	    _generateMsgStrip: function (msgtext,visible) {
                                			
                                			if(this._oMessageStrip){
                                				this._oMessageStrip.setVisible(visible);
                                				this._oMessageStrip.setText(msgtext);
                                			}

                                		},
                                		
                                		_destroyMsgStrip: function(visible)
                                		{
                                			if(this._oMessageStrip)
                                			{
                                				this._oMessageStrip.setVisible(visible);
                           				
                                			}
                                		},
                                		_loginrestcall:function(logdata)
                                		{
                                			
//                                			var authurl = "http://localhost:3000/users/authenticate";
//                                			var that = this;
//                                			
//                                			$.ajax(
//                                				      {
//                                				        url:authurl,
//                                				        type: 'POST',
//                                				        data: logdata,
//                                				        dataType:'json',
//                                				        success:function(data)
//                                				        {
//                                				        	that._loginsuccess(data,that);
//                                				        	var msgstrp = that.getView().byId("pageContainer");
//                                				        },
//                                				        error:function(err)
//                                				        {
//                                				         that._loginfailure(err,that);
//                                				         var msgstrp = view.byId("msgstrp");
//                                				        }
//                                			
//                                				      });			//AJAX call close		
                                		},
                                		_loginsuccess: function(data,that)
                                		{
//                                			if(data.success === false)
//                                				// Error with login, display message
//                                			{
//                                				that._generateMsgStrip(data.msg,true)
////                                				MessageToast.show(data.msg);
//                                			}
//                                			else
//                                				// Successful login, navigate to profile page
//                                			{
//                                				MessageToast.show("Welcome " +data.user.name)
//                                				that._destroyMsgStrip(false);
//
//                                				that._putAuthtoken(data.token);
//                                				
//                                				data.user_visible = true;
//                                				this.getOwnerComponent()._adjustButtons(data);
//                                				
//                                				
//                                    			this.getOwnerComponent()._adjustNavItems(true);
//                                    			
//                                				
//                                				var oRouter = that.getRouter();
//                                				var oTargets = this.getRouter().getTargets();
////                                				oTargets.display("dashboard");
//                                				oRouter.navTo("dashboard");
//                                				
//                                				
                                				
//                                			}
                                		},
                                		_loginfailure:function(err,that)
                                		{
//                                			that._generateMsgStrip("Incorrect UserID or password",true);
                                		
                                		},
                                		

                                		
                                		
                                		_putAuthtoken:function(token)
                                		{
//                                			if(!this._oStorage)
//                                			{
//                                				this._oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
//                                				
//                                			}
                                			
//                                			this._oStorage.put('authtoken',token);
                                		},
                                		_getAuthtoken:function()
                                		{
//                                			return this._oStorage.get('authtoken');
                                		},
                                		_removeAuthtoken:function()
                                		{
//                                			this._oStorage.remove('authtoken');
                                		}
 
                                    });
                });