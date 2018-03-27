sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element'],
  function(jQuery,Element) {
    "use strict";
    /**
     * Constructor for a new LineChartItem.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     *
     * @extends sap.ui.core.Element
     *
     * @author
     * @version
     *
     * @constructor
     * @public
     * @since 1.12
     * @alias
     *
     */

    var MultiLineChartItem = Element.extend("charts_sample.MultiLineChartItem", {
      metadata: {
        properties: {
          "date" : {type : "string", group : "Misc", defaultValue : null},
          "value" : {type : "string", group : "Misc", defaultValue : null},
          "series": {type : "string", group : "Misc", defaultValue : null}
        }
      }
    });
    return MultiLineChartItem;
  });
