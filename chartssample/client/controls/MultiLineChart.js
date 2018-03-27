jQuery.sap.require("charts_sample.libs.d3");
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control'],
  function(jQuery, Control) {
    "use strict";

    var MultiLineChartNew = Control.extend("charts_sample.MultiLineChart", {
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
            type: "charts_sample.MultiLineChartItem",
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

        // Set the dimensions of the canvas / graph
        var margin = {
            top: 30,
            right: 400,
            bottom: 70,
            left: 50
          },
          width = 1200 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

        // Parse the date / time
        var parseTime = d3.timeParse("%d-%b-%y");

        // Set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // Define the axes
        var xAxis = d3.axisBottom(x)
        var yAxis = d3.axisLeft(y)

        // Define the ordinal scale for colors
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        // Define the line
        var priceline = d3.line()
          .curve(d3.curveBasis)
          .x(function(d) {
            return x(d.date);
          })
          .y(function(d) {
            return y(d.value);
          });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = vis.append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .style("background-color", "white")
          .style("font", "12px sans-serif")
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // format the data
        data.forEach(function(d) {
          d.date = parseTime(d.date);
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) {
          return d.date;
        }));
        y.domain([0, d3.max(data, function(d) {
          return Math.max(d.value);
        })]);

        // Nest the entries by symbol
        var dataNest = d3.nest()
          .key(function(d) {
            return d.series;
          })
          .entries(data);

        // Space for inserting the legend
        var legendSpace = width / dataNest.length;

        // Loop through each symbol / key
        dataNest.forEach(function(d, i) {
          var p1 = svg.append("path")
            .attr("class", "line")
            .attr("d", priceline(d.values))
            .style("stroke", function() {
              return d.color = color(d.key);
            });
          
            // Add the Legend
            svg.append("text")
              .attr("x", width + 250)
              .attr("y", (i * legendSpace / 5) + 5)
              .attr("class", "mulserlegend")
              .style("fill", function() {
                return d.color = color(d.key);
              })
              .text(d.key);

        });

        // Add the X Axis
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        // text label for the x axis
        svg.append("text")
          .attr("x", width / 2)
          .attr("y", height + 40)
          .style("text-anchor", "middle")
          .text("Investment Period ->");

        // Add the Y Axis
        svg.append("g")
          .call(yAxis);

        // text label for the y axis
        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("dy", "1em")
          .attr("x", 0 - (height / 2))
          .attr("y", 0 - margin.left - 3)
          .style("text-anchor", "middle")
          .text("Growth(in Rs.)");

        // var p1 = svg.selectAll('path')
        //   .data(dataNest)
        //   .enter()
        //   .append('g');
        //
        // p1.append("path")
        //   .attr("class", "line")
        //   .attr("d", function(d) {
        //     return line(d.values);
        //   })
        //   .style("stroke", function(d) {
        //     return color(d.key);
        //   });


      }
    });

    /* =========================================================== */
    /*           begin: API methods                                */
    /* =========================================================== */

    /**
     * Initializes the control.
     * @private
     */
    MultiLineChartNew.prototype.init = function() {

    };



    /* =========================================================== */
    /*           begin: internal methods and properties            */
    /* =========================================================== */

    MultiLineChartNew.prototype.createChart = function() {
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


    return MultiLineChartNew;
  });
