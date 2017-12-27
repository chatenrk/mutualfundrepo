sap.ui
		.define(
				[ "sap/ui/core/mvc/Controller", "sap/ui/core/routing/History" ],
				function(Controller, History) {
					"use strict";

					return Controller
							.extend(
									"simple_hello.controller.BaseController",
									{

										onInit : function() 
										{
										},
										/*
										 * instantiate the I18n Model, this can
										 * be called by all child controllers
										 */
										_seti18nModel : function(view) {
											if (!this.i18nModel) {
												var i18nModel = new sap.ui.model.resource.ResourceModel(
														{
															bundleUrl : "i18n/i18n.properties"
														});
												this.i18nModel = i18nModel;
											}
											view.setModel(this.i18nModel,
													"i18n");
										},

										getJSONModel : function() {
											return new sap.ui.model.json.JSONModel();
										},
										getRouter : function() {
											return sap.ui.core.UIComponent
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