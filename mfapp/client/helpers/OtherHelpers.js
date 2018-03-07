sap.ui.define([], function() {
  "use strict";

  return {

    _formatCurrency: function(curr) {
      var x = curr.toString();
      var lastThree = x.substring(x.length - 3);
      var otherNumbers = x.substring(0, x.length - 3);
      if (otherNumbers != '')
        lastThree = ',' + lastThree;
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    }

  }
});
