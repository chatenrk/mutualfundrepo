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

    var ChartItem = Element.extend("charts_sample.PieChartItem", {
      metadata: {
        properties: {
          "key" : {type : "string", group : "Misc", defaultValue : null},
          "value" : {type : "string", group : "Misc", defaultValue : null}
        }
      }
    });
    return ChartItem;
  });
