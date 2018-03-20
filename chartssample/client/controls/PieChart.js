jQuery.sap.require("charts_sample.libs.d3");
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control'],
  function(jQuery, Control) {
    "use strict";

    var PieChart = Control.extend("charts_sample.PieChart", {
      metadata: {
        properties: {
          "title": {
            type: "string",
            group: "Misc",
            defaultValue: "Chart Title"
          }
        },
        defaultAggregation: "items",
        aggregations: {
          items: {
            type: "charts_sample.PieChartItem",
            multiple: true,
            singularName: "item"
          }
        },
        events: {
          "onPress": {},
          "onChange": {}
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
      onAfterRendering: function() {
        console.log("chart_demo.Chart.onAfterRendering()");
        console.log(this.sParentId);

        var cItems = this.getItems();
        var data = [];
        for (var i = 0; i < cItems.length; i++) {
          var oEntry = {};
          for (var j in cItems[i].mProperties) {
            oEntry[j] = cItems[i].mProperties[j];
          }
          data.push(oEntry);
        }

        /*
         * ATTENTION: See .createChart()
         * Here we're picking up a handle to the "parent" FlexBox with the ID we got in .createChart()
         * Now simply .append SVG elements as desired
         * EVERYTHING BELOW THIS IS PURE D3.js
         */

        var vis = d3.select("#" + this.sParentId);


        // set the dimensions and margins of the graph

        var width = 800;
        var height = 360;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 75;

        var legendRectSize = 18; // NEW
        var legendSpacing = 4; // NEW



        var color = d3.scaleOrdinal(d3.schemeCategory10);

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = vis.append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

        var arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);

        var pie = d3.pie()
          .value(function(d) {
            return d.value;
          })
          .sort(null);

        var tooltip = vis
                      .append('div')
                      .attr('class', 'pietooltip');

        tooltip.append('div')
          .attr('class', 'assettype');
        tooltip.append('div')
          .attr('class', 'amount');
        tooltip.append('div')
          .attr('class', 'percent');



        /*
         * Select all path elements inside our svg
         *  associate our dataset with the path elements
         * enter() method creates placeholder nodes for each of the values
         *
         */
        var path = svg.selectAll('path')
          .data(pie(data))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d) {
            return color(d.data.key);
          });

        path.on('mouseover', function(d) {
          var total = d3.sum(data.map(function(d) {
            return d.value;
          }));
          var percent = Math.round(1000 * d.data.value / total) / 10;
          tooltip.select('.assettype').html(d.data.key);
          tooltip.select('.amount').html(d.data.value);
          tooltip.select('.percent').html(percent + '%');
          tooltip.style('display', 'block');
        });
        path.on('mouseout', function() {
          tooltip.style('display', 'none');
        });


        var legend = svg.selectAll('.legend')
          .data(color.domain())
          .enter()
          .append('g')
          .attr('class', 'pielegend')
          .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 2;
            var horz = 12 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
          });

        legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', color)
          .style('stroke', color);
        legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) {
            return d;
          });
      }

    });

    /* =========================================================== */
    /*           begin: API methods                                */
    /* =========================================================== */

    /**
     * Initializes the control.
     * @private
     */
    PieChart.prototype.init = function() {


    };



    /* =========================================================== */
    /*           begin: internal methods and properties            */
    /* =========================================================== */

    PieChart.prototype.createChart = function() {
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

    };


    return PieChart;
  });
