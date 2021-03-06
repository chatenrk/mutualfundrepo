sap.ui.define(["sap/m/MessageStrip", "sap/m/MessageBox", "sap/m/Dialog", "sap/m/Button", "sap/m/Text"], function(MessageStrip, MessageBox, Dialog, Button, Text) {
  "use strict";

  return {
    _msgstripdisp: function(msgstrip, msgtxt) {
      if (msgstrip) {
        msgstrip.setVisible(visible);
        msgstrip.setText(msgtext);
      }
    },
    _msgbox: function(type, msg, title, onCloseFn,that) {
      if (type === "alert") {
        MessageBox.alert(msg, {
          title: title
        });
      } else if (type == "confirm") {
        MessageBox.confirm(msg, {
          title: title,
          onClose: function(oAction,that) {
            onCloseFn(oAction,that);
          }
        });
      }
      else if (type == "info") {
        MessageBox.information(msg, {
          title: title,
          onClose: function(oAction,that) {
            onCloseFn(oAction,that);
          }
        });
      }
    },
    _showConfirmDialog: function(CfmText, CfmYes, CfmNo) {
      var that = this;
      var deferred = jQuery.Deferred();

      var dialog = new Dialog({
        title: 'Confirm',
        type: 'Message',
        content: new Text({
          text: CfmText
        }),
        beginButton: new Button({
          text: CfmYes,
          press: function() {
            deferred.resolve(CfmYes);
            dialog.close();
          }
        }),
        endButton: new Button({
          text: CfmNo,
          press: function() {
            deferred.resolve(CfmNo);
            dialog.close();
          }
        }),
        afterClose: function() {
          dialog.destroy();
        }
      });

      dialog.open();
      return deferred.promise();
    }
  };
});
