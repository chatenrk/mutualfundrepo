sap.ui.define(["sap/m/MessageStrip", "sap/m/MessageBox"], function(MessageStrip, MessageBox) {
  "use strict";

  return {
    _msgstripdisp: function(msgstrip, msgtxt) {
      if (msgstrip) {
        msgstrip.setVisible(visible);
        msgstrip.setText(msgtext);
      }
    },
    _msgbox: function(type, msg, title) {
      if (type === "alert") {
        MessageBox.alert(msg, {
          title: title
        });
      }
    }
  };
});
