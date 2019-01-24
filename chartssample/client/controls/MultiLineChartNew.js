jQuery.sap.require("charts_sample.libs.d3");
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control'],
  function(jQuery, Control) {
    "use strict";

    var MultiLineChartNew = Control.extend("charts_sample.MultiLineChartNew", {
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
            type: "charts_sample.MultiLineChartItemNew",
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
        var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
          },
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

        // parse the date / time
        var parseTime = d3.timeParse("%d-%b-%y");



        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the 1st line
        var valueline = d3.line()
          .x(function(d) {
            return x(d.date);
          })
          .y(function(d) {
            return y(d.totcost);
          });

        // define the 2nd line
        var valueline2 = d3.line()
          .x(function(d) {
            return x(d.date);
          })
          .y(function(d) {
            return y(d.totval);
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

        // // format the data
        data.forEach(function(d) {
          d.date = parseTime(d.date);
          d.totcost = +d.totcost;
          d.totval = +d.totval;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) {
          return d.date;
        }));

        y.domain([0, d3.max(data, function(d) {
          return Math.max(d.totcost, d.totval);
        })]);

        // Add the valueline path.
        svg.append("path")
          .data([data])
          .attr("class", "line")
          .style("stroke", "red")
          .attr("d", valueline);

        // Add the valueline2 path.
        svg.append("path")
          .data([data])
          .attr("class", "line")
          .style("stroke", "green")
          .attr("d", valueline2);

        // Add the X Axis
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
          .call(d3.axisLeft(y));
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
