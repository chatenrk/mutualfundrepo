sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast", 'sap/m/Popover','sap/m/Button',
                	'sap/m/MessageStrip','sap/m/MessageToast','sap/ui/model/Filter','simple_hello/libs/Moment',],
                function(BaseController, MessageToast,Popover,Button,MessageStrip,Filter,Moment) {
                    "use strict";
                    
                    var _oStorage,_oMessageStrip,_amcdata,_schdata,_sname,_scode,_amccode,_navdata;
                    var _invdetPanel,_invtabPanel;
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
                                        	
                                        	this._invdetPanel = this.getView().byId("mfinvdet");
                                        	this._invdetPanel.setExpandable(true);
                                        	this.setPanelExpanded(this._invdetPanel,true);
                                        	
                                        	this._invtabPanel = this.getView().byId("mfinvtab");
                                        	this._invtabPanel.setExpandable(true);
                                        	this.setPanelExpanded(this._invtabPanel,false);
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
                                           this._amccode = amccode;
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
                                        	 
                                        	this._schdata = data;
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
                                        	var that = this;
                                        	data.amccode = this._amccode;
                                        	data.amcname = this.getView().byId("cbfname").getValue();
                                        	data.scode = this._scode[0];
                                        	data.sname = this.getView().byId("mfname").getValue();
                                    		data.invdate = this.getView().byId("mfinvdate").getValue();
                                    		data.amntinv = this.getView().byId("amntinv").getValue();
                                    		
                                    		data.remarks = this.getView().byId("remarks").getValue();
                                    		data.invFor = this.getView().byId("cbinvfor").getValue();
                                    		data.assetType = this.getView().byId("cbassettype").getValue();
                                    		
                                    		//This needs to be adjusted
                                    		data.invBy = "Chaitanya"
                                    		
                                    			if (data.amcname === "" || data.mfname === "" ||data.invdate === ""||data.amntinv === ""||data.invfor === ""||data.assettype === "")
                                            	{
                                            		this._generateMsgStrip("Please provide all the details on the form");
                                            	}
                                            	else
                                            	{
                                            		//NAV data
                                            		var navdata = this._getNAVData(data.scode,data.invdate);
                                            		
                                            		navdata.done(function(pdata)
                                            				{
                                            					if(pdata.length>0)
                                            					{
                                            						data.nav = pdata[0].nav;
                                            						data.units = data.amntinv / data.nav;
                                            						that._destroyMsgStrip(false);
                                            						that._invrestcall(data);
                                            					}
                                            					else
                                            					{
                                            						//Error fetching NAV Data
                                            						that._generateMsgStrip("Error fetching NAV. Please contact Admin")
                                            					}
                                            				});
                                            		
                                            	}
                                    			
                                  },
                                        _getNAVData:function(scode,invdate)
                                        {

                                        	var authurl = "http://localhost:3000/nav/navdet?scode="+scode+"&date="+invdate;
                                			var that = this;
                                		
                                			
                                			 return $.ajax(
                              				      {
                              				        url:authurl,
                              				        type: 'GET',
                              				        dataType:'json',
                              				        success:function(data)
                              				        {
                              				        	
                              				       
                              				        },
                              				        error:function(err)
                              				        {
                              				         
                              				       
                              				        }
                              			
                              				      });			//AJAX call close
                                			
                                			
                                			
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
                                		_invrestcall:function(logdata)
                                		{
                                			
                                			var authurl = "http://localhost:3000/mfinv/pone";
                                			var that = this;
                                			
                                			$.ajax(
                                				      {
                                				        url:authurl,
                                				        type: 'POST',
                                				        data: logdata,
                                				        dataType:'json',
                                				        success:function(data)
                                				        {
                                				        	that._invsuccess(data,that);
                                				        	
                                				        },
                                				        error:function(err)
                                				        {
                                				         that._invfailure(err,that);
                                				         
                                				        }
                                			
                                				      });			//AJAX call close		
                                		},
                                		_invsuccess: function(data,that)
                                		{
                                			// Change date from ISODate format to normal date. We are using the Moment JS framewrok for this
                                			data.operation.pdate = this._isodatetodate(data.operation.invdate);
                                			
                                			var pdata = that._parseData(data,that);
                                			var mfinsmodel = this.getView().getModel("mfins_model");
                            			    mfinsmodel.setData(data);
                            				mfinsmodel.updateBindings();
                            				this.setPanelExpanded(this._invdetPanel,false);
                            				this.setPanelExpanded(this._invtabPanel,true);
                                			
                                		},
                                		_invfailure:function(err,that)
                                		{
                                			
                                		
                                		},
                                		_parseData:function(data,that)
                                		{
                                			
                                		
                                			
                                			if(data.opsuccess === false)
                                				
                                			{
                                				switch(data.errcode)
                                				{
                                				case 11000:
                                					// Error inserting data. Display the same in the message strip
                                					data.msg = "Data already exists for combination of "+data.operation.sname +" and "+data.operation.pdate+". Please recheck"
                                					break;
                                				default:
                                					data.msg = "Error Occured. Please contact Admin"
                                				}
                                				that._generateMsgStrip(data.msg,true)
                                			}
                                			else
                                			{
                                				// Data inserted successfully
                                				var pdata ={};
                                				that._destroyMsgStrip(false);
                                				pdata.amcname = data.operation.amcname;
                                				pdata.sname = data.operation.sname;
                                				pdata.date = data.operation.pdate;
                                				pdata.nav = data.operation.nav;
                                				pdata.units = data.operation.units;
                                				pdata.invFor = data.operation.invFor;
                                				pdata.assetType = data.operation.assetType;
                                				return pdata;
                                				
                                			}
                                		},
                                		
                                		_isodatetodate:function(isodate)
                                		{
                                			 var pdate = moment(isodate).utcOffset("+05:30").format('DD-MMM-YYYY');
                                			 return pdate;
                                		}
                                    });
                });