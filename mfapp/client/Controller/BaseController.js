sap.ui
		.define(
				[ "sap/ui/core/mvc/Controller", "sap/ui/core/routing/History" ],
				function(Controller, History) {
					"use strict";
					var _oRouter;
					return Controller
							.extend(
									"simple_hello.Controller.BaseController",
									{

										onInit : function()
										{
											this.ownerComponent = this.getOwnerComponent();
										},

										getJSONModel : function() {
											return new sap.ui.model.json.JSONModel();
										},
										getRouter : function() {
											return  sap.ui.core.UIComponent
													.getRouterFor(this);
										},

										setPanelExpanded:function(panelName,expanded)
										{
											if(panelName.getExpanded() !== expanded)
											{
												panelName.setExpanded(expanded);
											}
										},

										onNavBack : function(oEvent) {
											var oHistory, sPreviousHash;
											oHistory = History.getInstance();
											sPreviousHash = oHistory
													.getPreviousHash();

											if (sPreviousHash !== undefined) {
												window.history.go(-1);
											} else {
												this.getRouter().navTo(
														"appHome", {}, true /*
																			 * no
																			 * history
																			 */);
											}
										}

									});

				});
