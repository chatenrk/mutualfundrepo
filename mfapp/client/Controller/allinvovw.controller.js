sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast","sap/ui/model/json/JSONModel" ],
                function(BaseController, MessageToast,JSONModel) {
                    "use strict";
                    var _ownerComponent;
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.allinvovw",
                                    {
                                        onInit : function()
                                        {
                                           this._ownerComponent = this.getOwnerComponent();
                                           this._getallinv();



                                        },
                                        _getallinv:function()
                                        {
                                          // This method returns all the investments for the logged in user

                                          //Get the logged in user from the models
                                          var lgdata = this._ownerComponent.getModel("loggedin_user").getData();

                                          if(lgdata && lgdata.user && lgdata.user.name !== '')
                                          {
                                              this._getinvrestcall(lgdata.user.name);
                                          }

                                        },
                                        _getinvrestcall:function(user)
                                        {
                                          var authurl = "http://localhost:3000/mfinv/mfinvdet?invBy="+user;
                                			    var that = this;

                                			       $.ajax(
                                				      {
                                				        url:authurl,
                                				        type: 'GET',
                                				        dataType:'json',
                                				        success:function(data)
                                				        {
                                				        	that._getinvsuccess(data,that);

                                				        },
                                				        error:function(err)
                                				        {
                                				         that._getinvfailure(err,that);

                                				        }

                                				      });			//AJAX call close
                                        },
                                        _getinvsuccess:function(data,that)
                                        {
                                          var oModel = new JSONModel(
                                            {
                                                allinvpath: "/allinv",
                                                allinv:data
                                            });


                                          this.getView().setModel(oModel, "allinvModel");
                                        },
                                        _getinvfailure:function(data,that)
                                        {

                                        }

                                    });
                });
