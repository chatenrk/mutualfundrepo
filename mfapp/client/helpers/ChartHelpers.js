sap.ui.define(["./DateHelpers", "./OtherHelpers", "./GatewayHelper"], function(DateHelpers, OtherHelpers, GatewayHelper) {
  "use strict";

  return {
    _renderinvcurrvalchart: function(data) {

      var prvscode, cntoffset = 2;
      var labels = [],
        chtdataInv = [],
        chtdataVal = [],
        lineData = [],
        datasets = [];
      var lineDataObj = {},
        dsValues = {};


      for (var i = 0; i < data.length; i++) {


        labels.push(data[i].projdate);
        chtdataInv.push(parseInt(data[i].totamnt));
        chtdataVal.push(parseInt(data[i].currval));

      }

      dsValues.label = "Total Investment";
      var dyncol = this.dynamicColors();
      dsValues.borderColor = dyncol;
      dsValues.backgroundColor = dyncol;
      dsValues.fill = false;
      dsValues.data = chtdataInv;
      datasets.push(dsValues);

      dsValues = {};
      dsValues.label = "Current Value of Investment";
      var dyncol = this.dynamicColors();
      dsValues.borderColor = dyncol;
      dsValues.backgroundColor = dyncol;
      dsValues.fill = false;
      dsValues.data = chtdataVal;
      datasets.push(dsValues);


      lineDataObj.datasets = datasets;
      lineDataObj.labels = labels;

      return lineDataObj;



    },
    dynamicColors: function() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);

      return "rgb(" + r + "," + g + "," + b + ")";
    },
  }
})
