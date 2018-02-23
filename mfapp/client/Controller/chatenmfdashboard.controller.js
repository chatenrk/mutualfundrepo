sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast", 'sap/m/Popover','sap/m/Button',
                	'sap/m/MessageStrip','sap/m/MessageToast','sap/m/GenericTile'],
                function(BaseController, MessageToast,Popover,Button,MessageStrip,GenericTile) {
                    "use strict";
                    var _oRouter;
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.chatenmfdashboard",
                                    {


                                        onInit : function()
                                        {

                                        	this._oRouter = this.getRouter();
                                        },
                                        onTilePress:function(oEvt)
                                        {
                                        	// Get the binding context. Pass the attached model name for this
                                        	var oBindingContext = oEvt.getSource().getBindingContext("dbtiles_model");
                                        	var tileid = oBindingContext.getProperty("id");

                                        	switch(tileid)
                                        	{
                                        	    case "addmfinv":
                                        	       this._oRouter.navTo("mfinvlog");
                                        	        break;

                                        	    case "dispallinv":
                                         	       this._oRouter.navTo("dispallinv");
                                         	        break;

                                              case "showallinv":
                                                 this._oRouter.navTo("showallinv");
                                                 break;

                                        	    default:
                                        	        break;
                                        	}



                                        }



                                    });
                });
