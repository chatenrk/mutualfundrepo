sap.ui
        .define(
                [ "simple_hello/controller/BaseController", "sap/m/MessageToast" ],
                function(BaseController, MessageToast) {
                    "use strict";
                    return BaseController
                            .extend(
                                    "simple_hello.controller.test",
                                    {
                                        onInit : function() 
                                        {
                                           var page = this.getView().byId("testPage");
                                           var ownerComponent = this.getOwnerComponent();
                                        }
                                         
 
                                    });
                });