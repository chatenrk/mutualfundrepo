/* global d3:true */
sap.ui
  .define(
    ["charts_sample/controller/BaseController", "../controls/MultiLineChartItem", "../controls/MultiLineChart"],
    function(BaseController, LineChartItem, LineChart) {
      "use strict";
      return BaseController
        .extend(
          "charts_sample.controller.mullinecht", {

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

              var oChartHolder = this.byId("ChartHolder");

              var data = this.getOwnerComponent().getModel("mulseriescht_model"); // This is set in the Component.js from local model

              var oChartItem = new LineChartItem({
                key: "{date}",
                value:"{temperature}",
                series:"{series}"
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
