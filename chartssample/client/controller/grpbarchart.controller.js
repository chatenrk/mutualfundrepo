/* global d3:true */
sap.ui
  .define(
    ["charts_sample/controller/BaseController","../controls/BarChartItem","../controls/BarChart"],
    function(BaseController,BarChartItem,BarChart) {
      "use strict";
      return BaseController
        .extend(
          "charts_sample.controller.grpbarchart", {

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
              // var linedata = sap.ui.getCore().getModel("simlinecht_model");
              var data = this.getOwnerComponent().getModel("simpiecht_model");
              var oChartHolder = this.byId("ChartHolder");
              var oChartItem = new BarChartItem({
                key: "{assettype}",
                value: "{total}"
              });
              var oChart = new BarChart({
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
