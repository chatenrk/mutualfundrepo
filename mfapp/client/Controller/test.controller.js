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
                                           
                                           this._getdata();
                                        },
                                        _getdata:function()
                                        {
                                        	var authurl = "http://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=3&tp=1&frmdt=01-Jan-2017&todt=18-May-2017";
                                   			var that = this;
                                   			
                                   			$.ajax(
                                   				      {
                                   				        url:authurl,
                                   				        type: 'GET',
                                   				        dataType:'jsonp',
                                   				        success:function(data)
                                   				        {
//                                   				        	that._getschsuccess(data,that);
                                   				       
                                   				        },
                                   				        error:function(err)
                                   				        {
//                                   				         that._getschfailure(err,that);
                                   				       
                                   				        },
                                   				        beforeSend:function
                                   			
                                   				      });			//AJAX call close	
                                        }
                                         
 
                                    });
                });