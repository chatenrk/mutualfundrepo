sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control',"../libs/highcharts"],
  function(jQuery, Control,Highchartstemp) {
    "use strict";

    var TestChart = Control.extend("hghcharts_demo.TestChart", {
      metadata: {
        properties: {
          "title": {
            type: "string",
            group: "Misc",
            defaultValue: "Chart Title"
          }
        }
      },
      renderer: function(oRm, oControl) {
        var layout = oControl.createChart();

        oRm.write("<div");
        oRm.writeControlData(layout); // writes the Control ID and enables event handling - important!
        oRm.writeClasses(); // there is no class to write, but this enables
        // support for ColorBoxContainer.addStyleClass(...)

        oRm.write(">");
        oRm.renderControl(layout);
        oRm.addClass('verticalAlignment');

        oRm.write("</div>");

      },
      createChart: function() {
        /*
         * Called from renderer
         */
        console.log("chart_demo.Chart.createChart()");
        var oChartLayout = new sap.m.VBox({
          alignItems: sap.m.FlexAlignItems.Center,
          justifyContent: sap.m.FlexJustifyContent.Center
        });
        var oChartFlexBox = new sap.m.FlexBox({
          height: "auto",
          alignItems: sap.m.FlexAlignItems.Center
        });
        /* ATTENTION: Important
         * This is where the magic happens: we need a handle for our SVG to attach to. We can get this using .getIdForLabel()
         * Check this in the 'Elements' section of the Chrome Devtools:
         * By creating the layout and the Flexbox, we create elements specific for this control, and SAPUI5 takes care of
         * ID naming. With this ID, we can append an SVG tag inside the FlexBox
         */
        this.sParentId = oChartFlexBox.getIdForLabel();
        oChartLayout.addItem(oChartFlexBox);

        return oChartLayout;

      },
      onAfterRendering: function() {
        console.log("chart_demo.Chart.onAfterRendering()");
        console.log(this.sParentId);

        var options = this._getChartOptions();
        Highcharts.chart(this.sParentId, options);
      },
      _getChartOptions: function() {
        return {
          title: {
            text: 'Solar Employment Growth by Sector, 2010-2016'
          },

          subtitle: {
            text: 'Source: thesolarfoundation.com'
          },

          yAxis: {
            title: {
              text: 'Number of Employees'
            }
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },

          plotOptions: {
            series: {
              label: {
                connectorAllowed: false
              },
              pointStart: 2010
            }
          },

          series: [{
            name: 'Installation',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
          }, {
            name: 'Manufacturing',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
          }, {
            name: 'Sales & Distribution',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
          }, {
            name: 'Project Development',
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
          }, {
            name: 'Other',
            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
          }],

          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }
        }
      }
    });
    return TestChart;
  });
