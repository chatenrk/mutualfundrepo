sap.ui
        .define(
                [ "simple_hello/Controller/BaseController", "sap/m/MessageToast", "	sap/ui/model/Sorter","sap/ui/model/Filter"],
                function(BaseController, MessageToast,Sorter,Filter) {
                    "use strict";
                    var _dialog;
                    return BaseController
                            .extend(
                                    "simple_hello.Controller.invdetldisp",
                                    {
                                        onInit : function()
                                        {
                                        	var oRouter = this.getRouter();
                                        	oRouter.attachRouteMatched(this._handleRouteMatched, this);

                                        },

                                        _handleRouteMatched:function(oEvt)
                                        {
                                        	 if (oEvt.getParameter("name") !== "invdetldisp") {

                                                 return;

                                             }

                                        	//  this._getSchemes();
                                        },
                                        _getSchemes: function()
                                        {
                                        	// instantiate dialog
                                			if (!this._dialog)
                                			{
                                				this._dialog = sap.ui.xmlfragment("simple_hello.view.busydialog", this);
                                				this.getView().addDependent(this._dialog);
                                			}

                                			// open dialog
                                			var oJSONModel = this.getJSONModel();
                                			var data = {
                                					title:"Get Scheme Data",
                                					text:"Retrieving all scheme data from Database. Please wait"
                                			}

                                			oJSONModel.setData(data);
                                			this.getView().setModel(oJSONModel,"busyDialog");

                                			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
                                			this._dialog.open();

                                			//Query and get the data
                                			this._schemerestcall();
                                        },
                                        _schemerestcall:function()
                                         {
                                        	var authurl = "http://localhost:3000/schemes/all";
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
                                        	 // Close the busy dialog
                                        	 if(that._dialog)
                                        	 {
                                        		 that._dialog.close();
                                        	 }

                                        	 // Set the data to scheme model
                                        	var schModel =  this.getView().getModel("scheme_model");
                                        	schModel.setData(data);
                                        	schModel.updateBindings();
                                         },
                                         _getschfailure:function(err,that)
                                         {
                                        	// Close the busy dialog
                                        	 if(that._dialog)
                                        	 {
                                        		 that._dialog.close();
                                        	 }
                                         },

                                     	handleViewSettingsDialogButtonPressed: function (oEvent)
                                     	{
                                     		if (!this._oDialog) {
                                				this._oDialog = sap.ui.xmlfragment("simple_hello.view.TableViewSettingsDialog", this);
                                			}
                                			// toggle compact style
                                			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
                                			this._oDialog.open();
                                     	},
                                     	handleVSConfirm: function(oEvent)
                                     	{
                                     		// This is called when the OK button is pressed in the view settings dialog

                                     		var oView = this.getView();
                                			var oTable = oView.byId("schdatatable");

                                			var mParams = oEvent.getParameters();
                                			var oBinding = oTable.getBinding("items");

                                			var sPath;
                                			var bDescending;
                                			var aSorters = [];

                                			sPath = mParams.sortItem.getKey();
                                			bDescending = mParams.sortDescending;
                                			aSorters.push(new Sorter(sPath, bDescending));
                                			oBinding.sort(aSorters);

                                     	},
                                     	onSchSearch: function(oEvent){

                                     		// add filter for search
                                			var aFilters = [];
                                			var sQuery = oEvent.getSource().getValue();
                                			if (sQuery && sQuery.length > 0) {
                                				var filter = new Filter("sname", sap.ui.model.FilterOperator.Contains, sQuery);
                                				aFilters.push(filter);
                                			}

                                			var oView = this.getView();
                                			var oTable = oView.byId("schdatatable");
                                			var oBinding = oTable.getBinding("items");
                                			oBinding.filter(aFilters, "Application");
                                     	},
                                     	handleSchemePress: function(oEvt)
                                     	{
                                     		var source = oEvt.getSource();
                                     		var oBindingContext = source.getBindingContext("scheme_model");
                                     		var scode = oBindingContext.getProperty("scode");


                                     		var oRouter = this.getRouter();
                                     		oRouter.navTo("schdet",{scode: scode});


//                                     		var listItem = oEvt.getParameters().listItem;
                                     	}

                                    });
                });
