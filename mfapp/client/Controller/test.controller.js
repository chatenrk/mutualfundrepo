sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast" ],
                function(BaseController, MessageToast) {
                    "use strict";
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.test",
                                    {
                                        onInit : function() 
                                        {
                                           var page = this.getView().byId("testPage");
                                           var ownerComponent = this.getOwnerComponent();
                                        }
                                         
 
                                    });
                });