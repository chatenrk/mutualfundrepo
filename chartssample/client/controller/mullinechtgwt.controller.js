/* global d3:true */
sap.ui
  .define(
    ["charts_sample/controller/BaseController","../controls/MultiLineChartItemNew","../controls/MultiLineChartNew"],
    function(BaseController,LineChartItem,LineChart) {
      "use strict";
      return BaseController
        .extend(
          "charts_sample.controller.mullinechtgwt", {

            handleNavButtonPress: function(evt) {
              this.nav.back("Master");
            },

            handleNavBack: function(evt) {
              this.nav.back("Master");
            },

            onBeforeRendering: function() {
              console.log("chart_demo.view.Line.onBeforeRendering()");
            },

            onAfterRendering: function() {
              this._rebindAll();
            },

            _rebindAll: function() {
              var data = this.getOwnerComponent().getModel("mullinechtgwt_model");   // This is set in the Component.js from local model
              var oChartHolder = this.byId("ChartHolder");
              var oChartItem = new LineChartItem({
                date: "{PurchaseDate}",
                totcost: "{TotalPurchase}",
                totval:"{TotalValue}"
              });
              var oChart = new LineChart({
                items: {
                  path: "/",
                  template: oChartItem
                }
              });


              oChart.setModel(data);
              oChartHolder.addItem(oChart);

            }
          });
    });
