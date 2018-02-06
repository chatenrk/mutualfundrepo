sap.ui
        .define(
                [ "split_app/Controller/BaseController", "sap/m/MessageToast" ],
                function(BaseController, MessageToast) {
                    "use strict";
                    return BaseController
                            .extend(
                                    "split_app.Controller.app",
                                    {
                                        onInit : function()
                                        {
                                          //  var page = this.getView().byId("testPage");
                                           var ownerComponent = this.getOwnerComponent();

                                          //  this._getdata();
                                        }



                                    });
                });
