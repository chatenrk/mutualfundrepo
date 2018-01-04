sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast", 'sap/m/Popover','sap/m/Button',
                	'sap/m/MessageStrip','sap/m/MessageToast','sap/m/GenericTile','simple_hello/models/formatter'],
                function(BaseController, MessageToast,Popover,Button,MessageStrip,GenericTile,Formatter) {
                    "use strict";
                    var _oRouter;
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.schdetails",
                                    {
                                    	
                                    	formatter:Formatter,
                                        onInit : function() 
                                        {
                                        	
                                        	this._oRouter = this.getRouter();
                                        	this._oRouter.attachRouteMatched(this._handleRouteMatched, this);
                                        },
                                        
                                        _handleRouteMatched: function (oEvt) 
                                        {
                                        	 
                                            if (oEvt.getParameter("name") !== "schdet") 
                                            {
                                                return;
                                            } 
                                            
                                            this.scode = oEvt.getParameter("arguments").scode;	
                                          //Query and get the data
                                			this._schdetrestcall();
                                          			            
                                      	},
                                      	_schdetrestcall:function()
                                        {
                                       	var authurl = "http://localhost:3000/schemes/sdet"+"?scode="+this.scode;
                               			var that = this;
                               			
                               			$.ajax(
                               				      {
                               				        url:authurl,
                               				        type: 'GET',
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
                                        
                                        _getschsuccess: function(data,that)
                                        {	
                                        	
                                        	// Format data
                                        	var formattedData = that.formatData(data[0])
                                        	// Bind data to the model
                                        	var oModel = that.getView().getModel("schdet_model");
                                        	
                                        	oModel.setData([]);
                                        	oModel.setData(data[0]);
//                                        	oModel.refresh();
                                        	
//                                        	this.getView().byId("objpghdr").bindElement("schdet_model");
                                        	
                                        },
                                        _getschfailure:function(err,that)
                                        {
                                        	
                                        },
                                        handleSchLinkPressed: function(oEvent) 
                                        {
                                        	var data = this.getView().getModel("schdet_model").getData();
                                        	var url = data.schurl;
                                			sap.m.URLHelper.redirect(url, true);
                                		},
                                		formatData:function(data)
                                		{
                                			// Format currency
                                			data.assets = this.formatCurrency(data.assets)+
                                						  " "+
                                						  data.assetqual + " " + data.assetcurr;
                                			
                                		},
                                		formatCurrency: function(curr)
                                		{
                                			var x=curr.toString();
                                			var lastThree = x.substring(x.length-3);
                                			var otherNumbers = x.substring(0,x.length-3);
                                			if(otherNumbers != '')
                                			    lastThree = ',' + lastThree;
                                			return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                                		}
                                        
                                       
 
                                    });
                });