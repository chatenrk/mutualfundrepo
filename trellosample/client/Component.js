sap.ui.define(["sap/ui/core/UIComponent"],

  function(UIComponent, Moment) {
    "use strict";
    return UIComponent.extend("trello_sample.Component", {

      init: function() {

        UIComponent.prototype.init.apply(this, arguments);
        // create the views based on the url/hash
        this.getRouter().initialize();

      },

      metadata: {
        manifest: "json"
      }

    });
  });
