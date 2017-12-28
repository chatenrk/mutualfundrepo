sap.ui
        .define(
                [ "simple_hello/controller/BaseController", "sap/m/MessageToast", 'sap/m/Popover','sap/m/Button',
                	'sap/m/MessageStrip','sap/m/MessageToast'],
                function(BaseController, MessageToast,Popover,Button,MessageStrip) {
                    "use strict";
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.app",
                                    {
                                    			
                                    
                                        onInit : function() 
                                        {
                                        	var usrlgndata = 
                                        	{
                                        			user_visible:false
                                        	};
                                        	
                                        	this.getOwnerComponent()._adjustNavItems(false);
                                        	this.getOwnerComponent()._adjustButtons(usrlgndata);

                                        },
                                    	handleUserNamePress: function (oEvent) {
                                    		
                                    		
                                    		// create popover
                                			if (!this._oPopover) {
                                				this._oPopover = sap.ui.xmlfragment("simple_hello.view.usrpopover", this);
                                				this.getView().addDependent(this._oPopover);
                                				
                                			}

                                			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
                                			var oButton = oEvent.getSource();
                                			jQuery.sap.delayedCall(0, this, function () {
                                				this._oPopover.openBy(oButton);
                                			});

                                		},
                                		
                                		handleLogoutPress:function(){
                                			
                                			var data = {};
                                			this._oPopover.close();
                                			
                                			this.getOwnerComponent()._adjustNavItems(false);
                            				
                            				data.user_visible = false;
                            				this.getOwnerComponent()._adjustButtons(data);
                            				
                            				var oRouter = this.getRouter();
                            				oRouter.navTo("login");
                            				
//                            				this._removeAuthtoken();
                                			
                                		},
                                		


                                    	onItemSelect : function(oEvent) 
                                    	{
                                			var item = oEvent.getParameter('item');
                                			var selkey = item.getKey();
                                			var oRouter = this.getRouter();
                                			oRouter.navTo(selkey);
                                		},
                                		
                                		 onSideNavButtonPress : function() {
                                 			var viewId = this.getView().getId();
                                 			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
                                 			var sideExpanded = toolPage.getSideExpanded();

//                                 			this._setToggleButtonTooltip(sideExpanded);

                                 			toolPage.setSideExpanded(!toolPage.getSideExpanded());
                                 		},

                                		
                                		
                                       
 
                                    });
                });