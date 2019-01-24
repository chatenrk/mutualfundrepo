/* global d3:true */
sap.ui
  .define(
    ["charts_sample/controller/BaseController","../controls/LineChartItem","../controls/LineChart"],
    function(BaseController,LineChartItem,LineChart) {
      "use strict";
      return BaseController
        .extend(
          "charts_sample.controller.simlinecht", {

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
              var linedata = this.getOwnerComponent().getModel("simlinecht_model");
              var oLineChartHolder = this.byId("LineChartHolder");
              var oLineChartItem = new LineChartItem({
                key: "{date}",
                value: "{close}"
              });
              var oLineChart = new LineChart({
                items: {
                  path: "/",
                  template: oLineChartItem
                }
              });


              oLineChart.setModel(linedata);
              oLineChartHolder.addItem(oLineChart);

            }
          });
    });
