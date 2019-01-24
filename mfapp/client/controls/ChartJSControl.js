sap.ui.define([
  'sap/ui/core/Control',
  './Chart.min'
], function(Control) {
  'use strict';

  var CHART_CANVAS_NAME_PREFIX = 'chartJSCanvas';

  return Control.extend('simple_hello.controls.ChartJSControl', {
    metadata: {
      properties: {
        width: {
          type: 'int',
          defaultValue: 400
        },
        height: {
          tyoe: 'int',
          defaultValue: 400
        },
        responsive: {
          type: 'string',
          defaultValue: 'false'
        },
        maintainAspectRatio: {
          type: 'string',
          defaultValue: 'true'
        },
        chartType: {
          type: 'string',
          defaultValue: 'Line'
        },
        data: {
          type: 'object'
        },
        options: {
          type: 'object'
        }
      },
      events: {
        update: {
          enablePreventDefault: true
        }
      }
    },

    init: function() {
      var _newCustomChart;
    },

    onBeforeRendering: function() {
      // set global property for responsiveness
      if (this.getResponsive() === "true") {
        Chart.defaults.global.responsive = true;
      } else {
        Chart.defaults.global.responsive = false;
      }

      // set global property for aspect ratio
      if (this.getMaintainAspectRatio() === "true") {
        Chart.defaults.global.maintainAspectRatio = true;
      } else {
        Chart.defaults.global.maintainAspectRatio = false;
      }
    },

    onAfterRendering: function() {
      // Get the context of the canvas element we want to select
      var ctx = document.getElementById(CHART_CANVAS_NAME_PREFIX + this.getId()).getContext("2d");


      var chartType = this.getChartType().charAt(0).toLowerCase() + this.getChartType().slice(1);
      var chartData = this.getData();
      var chartOptions = this.getOptions();
      this._newCustomChart = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: chartOptions

      });


    },

    exit: function() {
    //   this._newCustomChart.destroy();
    },

    renderer: function(oRm, oControl) {
      var oBundle = oControl.getModel('i18n').getResourceBundle();
      var width = oControl.getWidth();
      var height = oControl.getHeight();

      //Create the control
      oRm.write('<div');
      oRm.writeControlData(oControl);
      oRm.addClass("chartJSControl");
      oRm.addClass("sapUiResponsiveMargin");
      oRm.writeClasses();
      oRm.write('>');

      oRm.write('<canvas id="' + CHART_CANVAS_NAME_PREFIX + oControl.getId() + '" width="' + width + '" height="' + height + '"></canvas>');

      oRm.write('</div>');
    },

    update: function() {
      this._newCustomChart.update();
    }
  });
});