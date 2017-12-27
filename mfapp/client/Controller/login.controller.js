sap.ui
        .define(
                [ "simple_hello/controller/BaseController", "sap/m/MessageToast", 'sap/m/Popover','sap/m/Button',
                	'sap/m/MessageStrip','sap/m/MessageToast'],
                function(BaseController, MessageToast,Popover,Button,MessageStrip) {
                    "use strict";
                    return BaseController
                            .extend(
                                    "simple_hello.controller.login",
                                    {
                                    			
                                    
                                        onInit : function() 
                                        {
                                        	
                                        	var usrlgndata = {
                                        			user_visible:false
                                        	}
                                        	
                                        	this._adjustNavItems(false);
                                        	this._adjustButtons(usrlgndata);

                                        },
                                        onSubmit: function(oEvt){
                                        	
                                        	var viewId = this.getView().getId();
                                        	var username = this.getView().byId("user_ip").getValue();
                                        	var password = this.getView().byId("pwd_ip").getValue();
                                        	
                                        	if (username === "" || password === "")
                                        	{
                                        		this._generateMsgStrip("Please provide username and password");
                                        	}
                                        	else
                                        	{
                                        		this.getView().byId("user_ip").setValue("");
                                        		this.getView().byId("pwd_ip").setValue("");
                                        		this._destroyMsgStrip();
                                        		
                                        		var data = {
                                        				username:username,
                                        				password:password
                                        		}
                                        		this._loginrestcall(data);
                                        	}
                                        	
                                        },
                                        onRefresh: function()
                                        {
                                        	this._destroyMsgStrip();
                                        	this.getView().byId("user_ip").setValue("");
                                    		this.getView().byId("pwd_ip").setValue("");
                                        },
                                        onSideNavButtonPress : function() {
                                			var viewId = this.getView().getId();
                                			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
                                			var sideExpanded = toolPage.getSideExpanded();

                                			this._setToggleButtonTooltip(sideExpanded);

                                			toolPage.setSideExpanded(!toolPage.getSideExpanded());
                                		},
                                		_setToggleButtonTooltip : function(bLarge) {
                                			var toggleButton = this.getView().byId('sideNavigationToggleButton');
                                			if (bLarge) {
                                				toggleButton.setTooltip('Large Size Navigation');
                                			} else {
                                				toggleButton.setTooltip('Small Size Navigation');
                                			}
                                		},

                                    	onItemSelect : function(oEvent) {
                                			var item = oEvent.getParameter('item');
                                			var selkey = item.getKey();
                                			var viewId = this.getView().getId();
                                			var pageContainer = sap.ui.getCore().byId(viewId + "--pageContainer");
//                                			sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());
                                		},
                                    	handleUserNamePress: function (oEvent) {
                                    		
                                    		
                                    		// create popover
                                			if (!this._oPopover) {
                                				this._oPopover = sap.ui.xmlfragment("simple_hello.view.usrpopover", this);
                                				this.getView().addDependent(this._oPopover);
//                                				this._oPopover.bindElement("/ProductCollection/0");
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
                                			
                                			this._adjustNavItems(false);
                            				
                            				data.user_visible = false;
                            				this._adjustButtons(data);
                                			
                                		},
                                		
                                		_getMsgStrip: function()
                                		{
                                			return this.getView().byId("msgstrp");
                                		},
                                		
                                		_generateMsgStrip: function (msgtext) {
                                			
                                			window.msgstrp.setVisible(true);
                                			window.msgstrp.setText(msgtext);

                                		},
                                		
                                		_destroyMsgStrip: function()
                                		{
//                                			var msgstrp = this.getView().byId("msgstrp");
                                			if(window.msgstrp)
                                			{
                                				window.msgstrp.destroy();
                                			}
                                		},
                                		_loginrestcall:function(logdata)
                                		{
                                			
                                			var authurl = "http://localhost:3000/users/authenticate";
                                			var that = this;
                                			
                                			$.ajax(
                                				      {
                                				        url:authurl,
                                				        type: 'POST',
                                				        data: logdata,
                                				        dataType:'json',
                                				        success:function(data)
                                				        {
                                				        	that._loginsuccess(data,that);
                                				        	var msgstrp = that.getView().byId("pageContainer");
                                				        },
                                				        error:function(err)
                                				        {
                                				         that._loginfailure(err,that);
                                				         var msgstrp = view.byId("msgstrp");
                                				        }
                                			
                                				      });			//AJAX call close		
                                		},
                                		_loginsuccess: function(data,that)
                                		{
                                			if(data.success === false)
                                				// Error with login, display message
                                			{
                                				MessageToast.show(data.msg);
                                			}
                                			else
                                				// Successful login, navigate to profile page
                                			{
                                				MessageToast.show("Welcome " +data.user.name)
//                                				var oJSONModel = this.getView().getModel();
//                                				var data = oJSONModel.getData();
                                				
                                				that._adjustNavItems(true);
                                				
                                				data.user_visible = true;
                                				that._adjustButtons(data);
                                				
                                				var oRouter = that.getRouter();
                                				oRouter.navTo("dashboard");
                                				
                                			}
                                		},
                                		_loginfailure:function(err,that)
                                		{
//                                			this._generateMsgStrip(data.msg);
                                		},
                                		
// Use this function to adjust the navigation bar items. Display Login and register if user is logged out. Else
// display Dashboard etc                                		
                                		_adjustNavItems:function(usr_log_flag){
                                			
                                			
                                			var nbar_model = this.getOwnerComponent().getModel("navbar_model");
                                        	var data = nbar_model.getData();
                                        	
                                        	var nview_model = this.getJSONModel();
                                        	
                                        	var itms = [];
                                        	
                                        	for(var i=0;i<data.length;i++){
                                        		if(data[i].usr_log_flag === usr_log_flag)
                                        		{
                                        			itms.push(data[i]);
                                        		}
                                        	}
                                			
                                			
                                			var nlitems = this.getView().byId("nlitems");
                                			nlitems.destroyItems();
                                			
                                			nview_model.setData(null);
                                			nview_model.setData(itms);
                                			this.getView().setModel(nview_model,"nview_model");
                                		},
                                		_adjustButtons:function(usrlgndata)
                                		{
                                			var usrlgnmodel = this.getOwnerComponent().getModel("usrlgn_model");
                                			usrlgnmodel.setData(null);
                                			usrlgnmodel.setData(usrlgndata);
                            				
                                		}
 
                                    });
                });