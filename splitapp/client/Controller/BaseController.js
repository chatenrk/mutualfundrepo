sap.ui
		.define(
				[ "sap/ui/core/mvc/Controller", "sap/ui/core/routing/History" ],
				function(Controller, History) {
					"use strict";
					var _oRouter;
					var _lgndata;
					return Controller
							.extend(
									"split_app.Controller.BaseController",
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
