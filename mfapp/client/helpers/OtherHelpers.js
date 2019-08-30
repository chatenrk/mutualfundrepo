sap.ui.define(["simple_hello/libs/underscore"], function() {
  "use strict";

  return {
    _formatCurrency: function(curr) {
      var x = curr.toString();
      var lastThree = x.substring(x.length - 3);
      var otherNumbers = x.substring(0, x.length - 3);
      if (otherNumbers != "") lastThree = "," + lastThree;
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    },

    _showDialogViaFragment: function(fragmentname, modelname, modelobj, that) {
      if (!that._oDialog) {
        that._oDialog = sap.ui.xmlfragment(fragmentname, that);
      }

      that._oDialog.setModel(null, modelname);
      that._oDialog.setModel(modelobj, modelname);

      // toggle compact style
      jQuery.sap.syncStyleClass(
        "sapUiSizeCompact",
        that.getView(),
        that._oDialog
      );
      that._oDialog.open();
    },
    _findUnique: function(array,prop) {
      return _.uniq(array,prop);
    }
  };
});
