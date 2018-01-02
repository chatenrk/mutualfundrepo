sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast", 'sap/m/Popover','sap/m/Button',
                	'sap/m/MessageStrip','sap/m/MessageToast','sap/m/GenericTile'],
                function(BaseController, MessageToast,Popover,Button,MessageStrip,GenericTile) {
                    "use strict";
                    var _oRouter;
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.schdetails",
                                    {
                                    			
                                    
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
                                        
                                        _getschsuccess: function(data,that){
                                        	
                                        },
                                        _getschfailure:function(err,that)
                                        {
                                        	
                                        }

                                       
                                        
                                       
 
                                    });
                });