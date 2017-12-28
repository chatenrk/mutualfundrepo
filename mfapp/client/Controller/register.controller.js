sap.ui
        .define(
                [ "simple_hello/controller/BaseController", "sap/m/MessageToast", 'sap/m/Popover','sap/m/Button',
                	'sap/m/MessageStrip','sap/m/MessageToast'],
                function(BaseController, MessageToast,Popover,Button,MessageStrip) {
                    "use strict";
                    
                    var _oStorage,_oMessageStrip,_oView;
                    
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.register",
                                    {
                                    	
                                    	
                                    
                                    			
                                    
                                        onInit : function() 
                                        {
                                        	
                                        	var oModel = new sap.ui.model.json.JSONModel({
                            					HTML : 
                            					
                            					"<pre>Please follow the following password specifications" +
                            					"<dl><dt><strong>Rules:</strong></dt></dl>" +
                            					"<ul><li>Ensure password has <strong>1 uppercase letter</strong></li>" +
                            					"<li>Ensure password has <strong>1 special character</strong> from [!@#$&*]</li>" +
                            					"<li>Ensure password has <strong>1 digit</strong></li>" +
                            					"<li>Ensure password is minimum of <strong>8 characters</strong></li></ul>"+
                            					"</pre>" 
                            					
                            				});
                            				
                                        	this.getView().setModel(oModel);
                                        	
                                        	
                                        	this._oMessageStrip = this.getView().byId("msgstrp");
                                        	this._oView = this.getView();
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
//                            				
                                			}
                                		},
                                		
                                		onPwdPopoverPress: function()
                                		{
                                			// create popover
                                			if (!this._oPopover) {
                                				this._oPopover = sap.ui.xmlfragment("simple_hello.view.pwdSpecifications", this);
                                				this.getView().addDependent(this._oPopover);
                                				
                                			}

                                			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
                                			var oIcon = this.getView().byId('pwdicon');
                                			jQuery.sap.delayedCall(0, this, function () {
                                				this._oPopover.openBy(oIcon);
                                			});
                                		},
                                        
                                        onSubmit: function(oEvt)
                                        {
                                        	
//                                        	var viewId = this.getView().getId();
                                        	var name = this._oView.byId("name_ip").getValue();
                                        	var username = this._oView.byId("user_ip").getValue();
                                        	var password = this._oView.byId("pwd_ip").getValue();
                                        	var email = this._oView.byId("email_ip").getValue();
                                        	var cpassword = this._oView.byId("cpwd_ip").getValue();
                                        	
                                        	var pwdStrength = this._checkpwd(password);
 
// Validate the email address using email regex                                        	
                                        	if(this._validateEmail(email) === false)
                                        	{
                                        		this._generateMsgStrip("Invalid email id please check",true);
                                        	}
// Check if username and password fields are not empty                                        	
                                        	else if (username === "" || password === "")
                                        	{
                                        		this._generateMsgStrip("Please provide username and password",true);
                                        	}
// Check if password and confirm password fields match                                        	
                                        	else if(password !== cpassword)
                                        	{
                                        		this._generateMsgStrip("Password and confirm password dont match",true);
                                        	}
                                        	
                                        	else if(pwdStrength === "insuffpwd")
                                        	{
// Check for password strength                
                                        		this._generateMsgStrip("Password not complaint with specifications.Please check the information popup for more details",true);
                                        	}
// Pass the input to server for database insert                                        	
                                        	else
                                        	{
                                        		this._oView.byId("user_ip").setValue("");
                                        		this._oView.byId("pwd_ip").setValue("");
                                        		this._oView.byId("cpwd_ip").setValue("");
                                        		this._oView.byId("name_ip").setValue("");
                                        		this._oView.byId("email_ip").setValue("");
                                        		this._destroyMsgStrip(false);
                                        		
                                        		var data = {
                                        				username:username,
                                        				password:password,
                                        				name:name,
                                        				email:email
                                        		}
                                        		this._loginrestcall(data);
                                        	}
                                        },
                                        	
                                        _loginrestcall:function(logdata)
                                    	{
                                    			
                                    			var authurl = "http://localhost:3000/users/register";
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
                                    				       
                                    				        },
                                    				        error:function(err)
                                    				        {
                                    				         that._loginfailure(err,that);
                                    				       
                                    				        }
                                    			
                                    				      });			//AJAX call close		
                                    	},
                                        	
                                        _loginsuccess: function(data,that)
                                		{
                                			if(data.success === false)
                                				// Error with login, display message
                                			{
                                				// Check for duplicate email issue
                                				
                                				that._generateMsgStrip(data.msg,true)
                                			}
                                			else
                                				// Successful registration, navigate to logon page
                                			{
                                				MessageToast.show("Registration successful, please login now")
                                				that._destroyMsgStrip(false);
                                				var oRouter = that.getRouter();
                                				oRouter.navTo("");
                                				
                                				
                                				
                                			}
                                		},
                                		_loginfailure:function(err,that)
                                		{
                                			that._generateMsgStrip("Error with registration, please contact administrator",true);
                                		
                                		},
                                		onRefresh: function()
                                        {
                                        	this._destroyMsgStrip(false);
                                        	this._oView.byId("name_ip").setValue("");
                                        	this._oView.byId("email_ip").setValue("");
                                        	this._oView.byId("user_ip").setValue("");
                                        	this._oView.byId("pwd_ip").setValue("");
                                        	this._oView.byId("cpwd_ip").setValue("");
                                        },
                                        
                                        _validateEmail:function(email)
                                        {
                                        	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))  
                                        	  {  
                                        	    return true; 
                                        	  }
                                        	else
                                        	{
                                        		return false;
                                        	}
                                        },
                                        _checkpwd:function(pwd)
                                        {
//                                        	var pwdregex = ^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8}$;
                                        	
                                        	if(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8}$/.test(pwd))
                                        	{
                                        		return "pwdOK";
                                        	}
                                        	else
                                        	{
                                        		return "insuffpwd";
                                        	}
                                        }
                                       
 
                                    });
                });