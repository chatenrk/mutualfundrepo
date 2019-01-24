sap.ui
	.define(
		["proj_chartdb/controller/BaseController"],
		function (BaseController) {
			"use strict";
			var _oRouter;
			return BaseController
				.extend(
					"proj_chartdb.controller.chtdashboard", {


						/**
						 * Lifecycle method onInit. This is used to get an instance of the router
						 *
						 *-------------------------------------------------------------------------
						 * Version History Changes
						 * ------------------------------------------------------------------------
						 * @version: 0.1
						 * @author: Chaitanya Rayabharam
						 * @description: Initial Version
						 *------------------------------------------------------------------------
						 */
						onInit: function () {

							// get the router using the base controller class
							this._oRouter = this.getRouter();
						},

						/**
						 * event handler  method for tile press event
						 *
						 *-------------------------------------------------------------------------
						 * Version History Changes
						 * ------------------------------------------------------------------------
						 * @version: 0.1
						 * @author: Chaitanya Rayabharam
						 * @description: Initial Version
						 * @param: oEvt referring to the event triggered
						 *------------------------------------------------------------------------
						 */
						
						onTilePress: function (oEvt) {

							// Get the binding context. Pass the attached model name for this
							var oBindingContext = oEvt.getSource().getBindingContext("dbtiles_model");
							var tileid = oBindingContext.getProperty("id");

							// Based on the tile pressed, perform routing to the corresponding view
							switch (tileid) {

								case "onShowPharmaFunds": 
									this._oRouter.navTo("pharmachart");
									break;

								// case "onShowMulLineChart": // Line Chart routing
								// 	this._oRouter.navTo("mullinechart");
								// 	break;

								// case "onShowInvVsVal": // Line Chart routing
								// 	this._oRouter.navTo("invvallinechart");
								// 	break;



								// case "onShowPieChart": // Simple Pie Chart
								// 	this._oRouter.navTo("piechart");
								// 	break;


								// case "onShowGrpBarChart": // Group Bar Chart
								// 	this._oRouter.navTo("barchart");
								// 	break;

								default: break;
							}
						}
					});
		});